import React, { useState, useEffect } from 'react';
import { constitutionAPI, feedbackAPI } from '../api';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const AdminPanel = ({ currentUser, showNotification }) => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingEntry, setEditingEntry] = useState(null);
    const [formData, setFormData] = useState({
        type: 'article',
        title: '',
        part: '',
        articleNumber: '',
        content: '',
        order: 0
    });
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        fetchEntries();
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const res = await feedbackAPI.getAll();
            setFeedbacks(res.data);
        } catch (err) {
            console.error('Failed to fetch feedbacks', err);
        }
    };

    const fetchEntries = async () => {
        try {
            const res = await constitutionAPI.getAll();
            setEntries(res.data);
            setLoading(false);
        } catch (err) {
            showNotification('Failed to fetch entries', 'error');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'order' ? parseInt(value) || 0 : value
        }));
    };

    const handleQuillChange = (content) => {
        setFormData(prev => ({
            ...prev,
            content: content
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEntry) {
                await constitutionAPI.update(editingEntry._id, formData, currentUser._id);
                showNotification('Entry updated successfully', 'success');
            } else {
                await constitutionAPI.create(formData, currentUser._id);
                showNotification('Entry created successfully', 'success');
            }
            setFormData({
                type: 'article',
                title: '',
                part: '',
                articleNumber: '',
                content: '',
                order: 0
            });
            setEditingEntry(null);
            fetchEntries();
        } catch (err) {
            showNotification(err.response?.data?.error || 'Operation failed', 'error');
        }
    };



    const handleEdit = (entry) => {
        setEditingEntry(entry);
        setFormData({
            type: entry.type,
            title: entry.title,
            part: entry.part || '',
            articleNumber: entry.articleNumber || '',
            content: entry.content || '',
            order: entry.order || 0
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            try {
                await constitutionAPI.delete(id, currentUser._id);
                showNotification('Entry deleted', 'success');
                fetchEntries();
            } catch (err) {
                showNotification('Failed to delete', 'error');
            }
        }
    };

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['clean']
        ],
    };

    if (currentUser?.role !== 'admin') {
        return (
            <div className="py-20 text-center">
                <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
                <p className="text-zinc-300">You do not have permission to view this page.</p>
            </div>
        );
    }

    return (
        <div className="py-12 max-w-screen-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 bg-black/50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-4xl font-black text-zinc-100 tracking-tight">
                        Admin <span className="text-gradient">Panel</span>
                    </h2>
                    <p className="text-zinc-400 mt-1 font-medium italic">Manage the Constitution of India meticulously.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowFeedbackModal(true)}
                        className="px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-black rounded-2xl hover:shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0 text-sm flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        VIEW FEEDBACKS ({feedbacks.length})
                    </button>
                    <div className="bg-zinc-900 px-6 py-2 rounded-2xl shadow-sm border border-zinc-800 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-bold">
                            {currentUser.name?.[0] || 'A'}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Administrator</p>
                            <p className="text-sm font-bold text-zinc-200">{currentUser.name || 'Admin'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Form */}
                <div className="lg:col-span-4">
                    <div className="glass-card rounded-3xl p-8 shadow-xl border border-white sticky top-24">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-zinc-100">
                                {editingEntry ? 'Edit' : 'Add'} <span className="text-amber-500">Entry</span>
                            </h3>
                            {editingEntry && (
                                <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded-lg">Editing Mode</span>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-3 border border-zinc-800 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 outline-none bg-black font-bold text-zinc-200 transition-all"
                                    >
                                        <option value="preamble">Preamble</option>
                                        <option value="part">Part Title</option>
                                        <option value="article">Article</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Order</label>
                                    <input
                                        type="number"
                                        name="order"
                                        value={formData.order}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-3 border border-zinc-800 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 outline-none bg-black font-bold text-zinc-200 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-5 py-3 border border-zinc-800 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 outline-none bg-black font-bold text-zinc-200 transition-all"
                                    placeholder="e.g. Article 1: Name and territory..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {formData.type === 'part' && (
                                    <div>
                                        <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Part ID</label>
                                        <input
                                            type="text"
                                            name="part"
                                            value={formData.part}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-3 border border-zinc-800 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 outline-none bg-black font-bold text-zinc-200 transition-all"
                                            placeholder="e.g. part1"
                                        />
                                    </div>
                                )}
                                {formData.type === 'article' && (
                                    <div>
                                        <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Article No.</label>
                                        <input
                                            type="text"
                                            name="articleNumber"
                                            value={formData.articleNumber}
                                            onChange={handleInputChange}
                                            className="w-full px-5 py-3 border border-zinc-800 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 outline-none bg-black font-bold text-zinc-200 transition-all"
                                            placeholder="e.g. 21A"
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">Detailed Content</label>
                                <div className="quill-editor-wrapper bg-black rounded-2xl border border-zinc-800 overflow-hidden">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content}
                                        onChange={handleQuillChange}
                                        modules={quillModules}
                                        className="bg-zinc-900"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-amber-500 text-white font-black rounded-2xl hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-1 active:translate-y-0"
                                >
                                    {editingEntry ? 'SAVE CHANGES' : 'CREATE ENTRY'}
                                </button>
                                {editingEntry && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingEntry(null);
                                            setFormData({ type: 'article', title: '', part: '', articleNumber: '', content: '', order: 0 });
                                        }}
                                        className="px-6 py-4 border border-zinc-800 text-zinc-400 font-bold rounded-2xl hover:bg-zinc-800 transition-all"
                                    >
                                        CANCEL
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-8">
                    <div className="flex gap-6">
                        {/* TOC Sidebar */}
                        <div className="w-1/4 hidden xl:block">
                            <div className="glass-card rounded-3xl p-6 shadow-xl border border-white sticky top-24">
                                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                                    Navigation
                                </h4>
                                <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                    <button 
                                        onClick={() => window.scrollTo({ top: document.getElementById('table-preamble')?.offsetTop - 100, behavior: 'smooth' })}
                                        className="w-full text-left px-3 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-800/50 hover:text-amber-500 rounded-lg transition-all"
                                    >
                                        Preamble
                                    </button>
                                    {entries.filter(e => e.type === 'part').map(part => (
                                        <button 
                                            key={part._id}
                                            onClick={() => window.scrollTo({ top: document.getElementById(`entry-${part._id}`)?.offsetTop - 100, behavior: 'smooth' })}
                                            className="w-full text-left px-3 py-2 text-xs font-bold text-zinc-300 hover:bg-zinc-800/50 hover:text-amber-500 rounded-lg transition-all"
                                        >
                                            {part.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 glass-card rounded-3xl shadow-xl border border-white overflow-hidden bg-zinc-900/40">
                            <div className="p-6 border-b border-zinc-800 bg-zinc-900/60 flex justify-between items-center">
                                <h3 className="text-xl font-black text-zinc-100">Database <span className="text-zinc-400">({entries.length})</span></h3>
                                <div className="flex gap-2">
                                    <div className="p-2 bg-slate-100 rounded-lg text-zinc-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-black/80 text-zinc-400 text-[10px] uppercase font-black tracking-widest">
                                        <tr>
                                            <th className="px-6 py-4">Sort</th>
                                            <th className="px-6 py-4">Structure</th>
                                            <th className="px-6 py-4">Identification</th>
                                            <th className="px-6 py-4 text-right">Management</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {loading ? (
                                            <tr><td colSpan="4" className="px-6 py-12 text-center text-zinc-400 font-medium">Synchronizing with database...</td></tr>
                                        ) : entries.length === 0 ? (
                                            <tr><td colSpan="4" className="px-6 py-12 text-center text-zinc-400 font-medium">Database is empty.</td></tr>
                                        ) : (
                                            entries.map(entry => (
                                                <tr key={entry._id} id={entry.type === 'preamble' ? 'table-preamble' : `entry-${entry._id}`} className="hover:bg-zinc-900/80 transition-colors group">
                                                    <td className="px-6 py-5">
                                                        <span className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg text-xs font-black text-zinc-400">{entry.order}</span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                                                            entry.type === 'preamble' ? 'bg-amber-100 text-amber-700' :
                                                            entry.type === 'part' ? 'bg-amber-500/10 text-amber-500' :
                                                            'bg-emerald-100 text-emerald-700'
                                                        }`}>
                                                            {entry.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="text-sm font-black text-zinc-100 mb-0.5">{entry.title}</div>
                                                        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">
                                                            {entry.articleNumber ? `Article ${entry.articleNumber}` : entry.part ? `Internal ID: ${entry.part}` : 'General Section'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleEdit(entry)}
                                                                className="w-10 h-10 flex items-center justify-center bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/10"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(entry._id)}
                                                                className="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student Feedback Modal */}
            {showFeedbackModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowFeedbackModal(false)}></div>
                    <div className="relative glass-card w-full max-w-2xl max-h-[85vh] rounded-3xl p-8 shadow-2xl border border-white animate-scale-in flex flex-col">
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h3 className="text-2xl font-black text-zinc-100 flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                </div>
                                Student Feedback
                            </h3>
                            <button onClick={() => setShowFeedbackModal(false)} className="text-zinc-400 hover:text-zinc-300 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar grow">
                            {feedbacks.length === 0 ? (
                                <div className="text-center py-8 text-zinc-400 font-medium bg-black/50 rounded-2xl border border-dashed border-zinc-800">
                                    No feedback received yet.
                                </div>
                            ) : (
                                feedbacks.map(fb => (
                                    <div key={fb._id} className="bg-black p-6 rounded-2xl border border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-bold text-zinc-200">{fb.user?.email || 'Unknown User'}</div>
                                            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{new Date(fb.createdAt).toLocaleDateString()}</div>
                                        </div>
                                        <p className="text-zinc-300 leading-relaxed">{fb.text}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;



