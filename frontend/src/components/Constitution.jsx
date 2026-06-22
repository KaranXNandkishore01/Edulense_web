import React, { useState, useEffect, useRef } from 'react';
import { highlightsAPI, constitutionAPI, progressAPI } from '../api';

const Constitution = ({ currentUser, onShowHighlights, showNotification, onRequestLogin }) => {
    const [highlightsCount, setHighlightsCount] = useState(0);

    useEffect(() => {
        if (currentUser) {
            highlightsAPI.getAll(currentUser._id)
                .then(res => setHighlightsCount(res.data.length))
                .catch(err => console.error(err));
        }
    }, [currentUser]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [selectionMenu, setSelectionMenu] = useState(null);
    const selectionRangeRef = useRef(null);
    const [constitutionData, setConstitutionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [completedParts, setCompletedParts] = useState([]);

    useEffect(() => {
        if (currentUser) {
            progressAPI.get(currentUser._id)
                .then(res => setCompletedParts(res.data.completedChapters || []))
                .catch(err => console.error(err));
        }
    }, [currentUser]);

    const handleMarkComplete = async (partId) => {
        if (!currentUser) {
            showNotification('Please login to track progress', 'warning');
            onRequestLogin();
            return;
        }
        try {
            const res = await progressAPI.markComplete({ userId: currentUser._id, chapterId: partId });
            setCompletedParts(res.data.completedChapters);
            showNotification('Marked as completed!', 'success');
        } catch (err) {
            showNotification('Failed to save progress', 'error');
        }
    };

    useEffect(() => {
        const fetchConstitution = async () => {
            try {
                const res = await constitutionAPI.getAll();
                setConstitutionData(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch constitution:', err);
                setLoading(false);
            }
        };
        fetchConstitution();
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.selection-menu') && !e.target.closest('.highlight-text')) {
                setSelectionMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleTextSelection = (e) => {
        if (e.target.closest('.selection-menu')) return;

        const selection = window.getSelection();
        const text = selection.toString().trim();

        if (text.length < 5) {
            setSelectionMenu(null);
            return;
        }

        const anchorNode = selection.anchorNode;
        let parentElement = anchorNode?.parentElement;

        while (parentElement && !parentElement.getAttribute('data-article')) {
            parentElement = parentElement.parentElement;
            if (parentElement === document.body) {
                parentElement = null;
                break;
            }
        }

        const article = parentElement?.getAttribute('data-article') || 'General';

        const range = selection.getRangeAt(0);
        selectionRangeRef.current = range.cloneRange();
        const rect = range.getBoundingClientRect();

        setSelectionMenu({
            text,
            article,
            x: rect.left + (rect.width / 2),
            y: rect.top + window.scrollY - 10
        });
    };

    const handleSaveHighlight = async (type, color = '') => {
        if (!currentUser) {
            showNotification('Please login to save', 'warning');
            onRequestLogin();
            setSelectionMenu(null);
            return;
        }

        try {
            await highlightsAPI.create({
                user: currentUser._id,
                highlight_text: selectionMenu.text,
                highlight_article: selectionMenu.article,
                type,
                color
            });
            showNotification(`Saved as ${type}!`, 'success');
            setHighlightsCount(prev => prev + 1);

            if (selectionRangeRef.current) {
                const span = document.createElement('span');
                if (type === 'highlight') {
                    span.className = 'style-highlight';
                } else if (type === 'underline') {
                    span.className = 'style-underline';
                } else if (type === 'bookmark') {
                    span.className = 'style-bookmark';
                } else if (type === 'doodle') {
                    span.className = 'style-doodle';
                    span.style.backgroundColor = color;
                }

                try {
                    selectionRangeRef.current.surroundContents(span);
                } catch (e) {
                    const highlightedText = selectionRangeRef.current.extractContents();
                    span.appendChild(highlightedText);
                    selectionRangeRef.current.insertNode(span);
                }
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                showNotification(err.response.data.error, 'error');
            } else {
                showNotification('Failed to save', 'error');
            }
        }

        window.getSelection().removeAllRanges();
        setSelectionMenu(null);
    };

    const scrollToArticle = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="py-8 relative">
            {selectionMenu && (
                <div
                    className="selection-menu absolute z-50 glass-card shadow-2xl rounded-xl p-2 border border-zinc-800 flex flex-col gap-3 transform -translate-x-1/2 -translate-y-full fade-in"
                    style={{ left: selectionMenu.x, top: selectionMenu.y }}
                >
                    <div className="flex items-center font-medium">
                        <button onClick={() => handleSaveHighlight('highlight')} className="flex items-center gap-1.5 text-sm text-amber-600 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-amber-200">
                            🖊️ Highlight
                        </button>
                    </div>
                </div>
            )}
            <div className="max-w-screen-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="glass-card rounded-2xl p-6 shadow-lg sticky top-24">
                            <h3 className="font-bold text-zinc-100 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                                Table of Contents
                            </h3>
                            <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                                {(() => {
                                    let serial = 1;
                                    const processedTOC = [];
                                    let currentPart = null;

                                    constitutionData.forEach(item => {
                                        if (item.type === 'preamble') {
                                            processedTOC.push({ ...item, serial: serial++ });
                                        } else if (item.type === 'part') {
                                            currentPart = { ...item, serial: serial++, articles: [] };
                                            processedTOC.push(currentPart);
                                        } else if (item.type === 'article') {
                                            if (currentPart) {
                                                currentPart.articles.push(item);
                                            } else {
                                                processedTOC.push({ ...item, serial: serial++ });
                                            }
                                        }
                                    });

                                    return processedTOC.map((item) => (
                                        <React.Fragment key={item._id}>
                                            <button
                                                onClick={() => scrollToArticle(item.type === 'part' ? item.part : item.type === 'preamble' ? 'preamble' : `article-${item.articleNumber}`)}
                                                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all flex items-start gap-2 ${
                                                    item.type === 'part' 
                                                        ? 'font-black text-zinc-100 bg-black mt-4 border border-zinc-800 hover:border-zinc-700' 
                                                        : 'text-zinc-300 hover:bg-zinc-800/50 hover:text-amber-500'
                                                }`}
                                            >
                                                <span className="text-[10px] font-black opacity-40 mt-0.5">{item.serial}.</span>
                                                <span className="flex-1 leading-tight">{item.title}</span>
                                            </button>
                                            {item.articles && item.articles.map((article) => (
                                                <button
                                                    key={article._id}
                                                    onClick={() => scrollToArticle(`article-${article.articleNumber}`)}
                                                    className="w-full text-left pl-7 pr-3 py-1.5 text-[11px] font-bold text-zinc-400 hover:text-amber-400 hover:bg-zinc-800/50/50 rounded-lg transition-all border-l-2 border-zinc-800/50 ml-4 mb-0.5"
                                                >
                                                    <span className="opacity-60 mr-1">Article {article.articleNumber}:</span>
                                                    {article.title}
                                                </button>
                                            ))}
                                        </React.Fragment>
                                    ));
                                })()}
                            </div>
                            <div className="mt-6 pt-6 border-t border-zinc-800">
                                <button onClick={onShowHighlights} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all hover:-translate-y-0.5">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
                                    My Highlights & Bookmarks ({highlightsCount})
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="glass-card rounded-2xl p-8 shadow-lg">
                            <div className="flex flex-col gap-6 mb-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gradient">The Constitution of India</h2>
                                    {currentUser && (
                                        <div className="text-sm text-zinc-400 bg-yellow-50 px-4 py-2 rounded-lg">
                                            💡 Select text to highlight
                                        </div>
                                    )}
                                </div>

                            </div>
                            <div onMouseUp={handleTextSelection} className="prose prose-lg max-w-none transition-all duration-500 ease-in-out">
                                {loading ? (
                                    <div className="py-12 text-center text-zinc-400 flex flex-col items-center gap-3 animate-pulse">
                                        <svg className="w-8 h-8 animate-spin text-amber-500" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75"></path></svg>
                                        Loading constitution data...
                                    </div>
                                ) : constitutionData.length === 0 ? (
                                    <div className="py-12 text-center text-zinc-400 italic">No data available. Add content from Admin Panel.</div>
                                ) : (
                                    constitutionData.map(item => (
                                        <div key={item._id} id={item.type === 'part' ? item.part : item.type === 'preamble' ? 'preamble' : `article-${item.articleNumber}`} className="mb-12 fade-in">
                                            {item.type === 'preamble' && (
                                                <>
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h3 className="text-xl font-bold text-amber-500 flex items-center gap-2">
                                                            <span className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-sm">📜</span> {item.title}
                                                        </h3>
                                                        {completedParts.includes('preamble') ? (
                                                            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 bg-emerald-500/10 px-5 py-2 rounded-xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                                                                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                                                    <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                                </div>
                                                                Completed
                                                            </div>
                                                        ) : (
                                                            <button 
                                                                onClick={() => handleMarkComplete('preamble')} 
                                                                className="group relative flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-emerald-400 bg-zinc-900 hover:bg-emerald-500/10 px-5 py-2 rounded-xl transition-all duration-300 border border-zinc-800 hover:border-emerald-500/50 shadow-sm hover:shadow-emerald-500/20 active:scale-95"
                                                            >
                                                                <div className="w-5 h-5 rounded-full border-2 border-zinc-600 group-hover:border-emerald-400 transition-colors flex items-center justify-center">
                                                                    <svg className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                                </div>
                                                                Mark as Completed
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="bg-gradient-to-r from-zinc-900 to-black p-6 rounded-xl border-l-4 border-amber-500">
                                                        <div 
                                                            className="text-zinc-200 leading-relaxed highlight-text quill-content" 
                                                            data-article="Preamble"
                                                            dangerouslySetInnerHTML={{ __html: item.content }}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            {item.type === 'part' && (
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-xl font-bold text-amber-500 flex items-center gap-2">
                                                        <span className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-sm">I</span> {item.title}
                                                    </h3>
                                                </div>
                                            )}
                                            {item.type === 'article' && (
                                                <div className="p-5 bg-zinc-900 rounded-xl border border-zinc-800 hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-4 gap-4">
                                                        <h4 className="font-semibold text-zinc-100 flex-1">Article {item.articleNumber}: {item.title}</h4>
                                                        {completedParts.includes(`article-${item.articleNumber}`) ? (
                                                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)] shrink-0">
                                                                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                                                                    <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                                </div>
                                                                Completed
                                                            </div>
                                                        ) : (
                                                            <button 
                                                                onClick={() => handleMarkComplete(`article-${item.articleNumber}`)} 
                                                                className="group relative flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-emerald-400 bg-zinc-900 hover:bg-emerald-500/10 px-3 py-1.5 rounded-lg transition-all duration-300 border border-zinc-800 hover:border-emerald-500/50 shadow-sm hover:shadow-emerald-500/20 active:scale-95 shrink-0"
                                                            >
                                                                <div className="w-4 h-4 rounded-full border-2 border-zinc-600 group-hover:border-emerald-400 transition-colors flex items-center justify-center">
                                                                    <svg className="w-2.5 h-2.5 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                                </div>
                                                                Mark Complete
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div 
                                                        className="text-zinc-300 highlight-text quill-content" 
                                                        data-article={`Article ${item.articleNumber}`}
                                                        dangerouslySetInnerHTML={{ __html: item.content }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Constitution;



