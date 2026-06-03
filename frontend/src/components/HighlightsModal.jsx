import React, { useState, useEffect } from 'react';
import { highlightsAPI } from '../api';

const HighlightsModal = ({ currentUser, onClose, showNotification }) => {
    const [highlights, setHighlights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            highlightsAPI.getAll(currentUser._id)
                .then(res => {
                    setHighlights(res.data);
                })
                .catch(() => showNotification('Failed to load highlights and bookmarks', 'error'))
                .finally(() => setLoading(false));
        }
    }, [currentUser]);

    const handleDelete = async (id) => {
        try {
            await highlightsAPI.delete(id);
            setHighlights(prev => prev.filter(h => h._id !== id));
            showNotification('Point removed', 'success');
        } catch (err) {
            showNotification('Failed to remove point', 'error');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 py-8">
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity" onClick={onClose}></div>
                <div className="relative bg-zinc-900 rounded-3xl p-8 max-w-3xl w-full max-h-[85vh] shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] flex flex-col transform transition-all border border-white/50">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800 shrink-0">
                        <div>
                            <h3 className="text-2xl font-black text-zinc-100 flex items-center gap-3">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white shadow-lg shadow-yellow-500/30">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
                                </span>
                                My Highlights & Bookmarks
                            </h3>
                            <p className="text-sm text-zinc-400 mt-2 font-medium">Review important points you've saved for quizzes</p>
                        </div>
                        <button onClick={onClose} className="p-2.5 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800 rounded-xl transition-all self-start">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-5 overflow-y-auto grow pr-3 custom-scrollbar">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-4">
                                <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
                                <p className="text-zinc-400 font-medium">Loading your highlights and bookmarks...</p>
                            </div>
                        ) : highlights.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-12 h-12 text-amber-300" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
                                </div>
                                <h4 className="text-lg font-bold text-zinc-100 mb-2">No points saved yet</h4>
                                <p className="text-zinc-400 max-w-sm">Select important text in the Constitution and click "Highlight" or "Bookmark" to save them for your personalized quizzes.</p>
                            </div>
                        ) : (
                            highlights.map((h) => (
                                <div key={h._id} className="group relative p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-amber-300 hover:shadow-[0_8px_30px_rgb(251,191,36,0.12)] transition-all duration-300">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-300 to-yellow-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${h.type === 'bookmark' ? 'text-amber-400 bg-indigo-900/60/80 border-amber-600/50' : 'text-amber-700 bg-amber-100/80 border-amber-200/50'}`}>
                                                    {h.type === 'bookmark' ? '🔖 Bookmark' : '🖊️ Highlight'}
                                                </span>
                                                <span className="text-xs font-bold text-zinc-300 bg-slate-100 px-3 py-1 rounded-full border border-zinc-800">
                                                    {h.highlight_article}
                                                </span>
                                                <span className="text-xs font-medium text-zinc-400">
                                                    {formatDate(h.createdAt)}
                                                </span>
                                            </div>
                                            <blockquote className="text-zinc-200 leading-relaxed font-medium">
                                                "{h.highlight_text}"
                                            </blockquote>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(h._id)} 
                                            className="p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shrink-0 bg-black border border-zinc-800 group-hover:border-red-100 group-hover:bg-zinc-900"
                                            title="Remove point"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HighlightsModal;


