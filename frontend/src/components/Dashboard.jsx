import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { highlightsAPI, quizzesAPI, feedbackAPI, progressAPI } from '../api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DIFFICULTY_COLORS = {
    easy: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    hard: 'bg-rose-100 text-rose-700',
};

const Dashboard = ({ currentUser }) => {
    const [highlights, setHighlights] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [completedChapters, setCompletedChapters] = useState([]);
    const [feedbackText, setFeedbackText] = useState('');
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [feedbackStatus, setFeedbackStatus] = useState(null); // { type: 'success'|'error', msg }
    const navigate = useNavigate();

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setIsSubmittingFeedback(true);
        setFeedbackStatus(null);
        try {
            await feedbackAPI.create({ user: currentUser._id, text: feedbackText });
            setFeedbackText('');
            setFeedbackStatus({ type: 'success', msg: '✅ Feedback submitted successfully!' });
        } catch(err) {
            console.error(err);
            setFeedbackStatus({ type: 'error', msg: '❌ Failed to submit feedback. Please try again.' });
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    const [totalConstitutionParts, setTotalConstitutionParts] = useState(448); // default to ~448 articles

    useEffect(() => {
        if (currentUser) {
            highlightsAPI.getAll(currentUser._id).then(res => setHighlights(res.data)).catch(console.error);
            quizzesAPI.getAll(currentUser._id).then(res => setQuizzes(res.data)).catch(console.error);
            progressAPI.get(currentUser._id).then(res => setCompletedChapters(res.data.completedChapters || [])).catch(console.error);
        }
        // Fetch total parts dynamically
        import('../api').then(({ constitutionAPI }) => {
            constitutionAPI.getAll().then(res => {
                if (res.data && res.data.length > 0) {
                    setTotalConstitutionParts(res.data.length);
                }
            }).catch(console.error);
        });
    }, [currentUser]);

    const handleDeleteHighlight = async (id) => {
        try {
            await highlightsAPI.delete(id);
            setHighlights(prev => prev.filter(h => h._id !== id));
        } catch (err) {
            console.error('Failed to delete highlight', err);
        }
    };

    const avgScore = quizzes.length > 0
        ? Math.round(quizzes.reduce((acc, q) => acc + (q.quiz_score / q.quiz_total * 100), 0) / quizzes.length)
        : 0;

    const highestScore = quizzes.length > 0
        ? Math.max(...quizzes.map(q => Math.round((q.quiz_score / q.quiz_total) * 100)))
        : 0;

    let scoreTrend = 0;
    if (quizzes.length >= 2) {
        const last = Math.round((quizzes[quizzes.length - 1].quiz_score / quizzes[quizzes.length - 1].quiz_total) * 100);
        const secondLast = Math.round((quizzes[quizzes.length - 2].quiz_score / quizzes[quizzes.length - 2].quiz_total) * 100);
        scoreTrend = last - secondLast;
    }

    const rawProgressPct = totalConstitutionParts ? (completedChapters.length / totalConstitutionParts) * 100 : 0;
    const readingProgressPct = completedChapters.length > 0 && rawProgressPct < 1 ? 1 : Math.round(rawProgressPct);

    const chartData = quizzes.map((q, index) => ({
        name: `Quiz ${index + 1}`,
        score: Math.round((q.quiz_score / q.quiz_total) * 100),
        date: new Date(q.quiz_date).toLocaleDateString()
    }));

    return (
        <div className="py-8 max-w-screen-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-zinc-100 mb-2">Student Dashboard</h2>
                <p className="text-zinc-300">Welcome back {currentUser.email.split('@')[0]}! Track your progress and review your highlights.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Stats Cards */}
                <div className="lg:col-span-3 grid sm:grid-cols-3 gap-6">
                    <div className="glass-card rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold">H</div>
                            <div>
                                <p className="text-sm text-zinc-400">Total Highlights</p>
                                <p className="text-2xl font-bold text-zinc-100">{highlights.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">Q</div>
                            <div>
                                <p className="text-sm text-zinc-400">Quizzes Taken</p>
                                <p className="text-2xl font-bold text-zinc-100">{quizzes.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold">%</div>
                            <div>
                                <p className="text-sm text-zinc-400">Average Score</p>
                                <p className="text-2xl font-bold text-zinc-100">{avgScore}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Progress Container */}
                <div className="lg:col-span-3 grid lg:grid-cols-3 gap-6">
                    {/* Progress Graph */}
                    <div className="lg:col-span-2 glass-card rounded-2xl p-6 shadow-lg flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-zinc-100">Performance Progress</h3>
                                <p className="text-sm text-zinc-400">Your test scores over time</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="text-right">
                                    <p className="text-xs text-zinc-400">Highest Score</p>
                                    <p className="text-lg font-bold text-emerald-400">{highestScore}%</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-zinc-400">Recent Trend</p>
                                    <p className={`text-lg font-bold ${scoreTrend > 0 ? 'text-emerald-400' : scoreTrend < 0 ? 'text-rose-400' : 'text-zinc-400'}`}>
                                        {scoreTrend > 0 ? '+' : ''}{scoreTrend}%
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 min-h-[250px] w-full mt-2">
                            {quizzes.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-zinc-400 bg-black/50 rounded-xl border border-dashed border-zinc-800">
                                    Take some quizzes to see your progress graph!
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                                        <defs>
                                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} dx={-10} tickFormatter={(val) => `${val}%`} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff' }}
                                            itemStyle={{ color: '#c4b5fd', fontWeight: 'bold' }}
                                            labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                                            formatter={(value, name, props) => [`${value}%`, `Score (${props.payload.date})`]}
                                            labelFormatter={(label) => `${label}`}
                                        />
                                        <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff', fill: '#8b5cf6' }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Reading Progress Tracker */}
                    <div className="lg:col-span-1 glass-card rounded-2xl p-6 shadow-lg flex flex-col justify-between relative overflow-hidden group">
                        {/* Glow Effects */}
                        <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full group-hover:bg-emerald-500/20 transition-all duration-500"></div>
                        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-500/5 blur-3xl rounded-full"></div>
                        
                        <div className="z-10">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-zinc-100">Reading Progress</h3>
                            </div>
                            <p className="text-sm text-zinc-400 ml-11">Constitution Articles</p>
                        </div>

                        <div className="flex flex-col items-center justify-center my-8 z-10 relative">
                            <div className="relative w-40 h-40 flex items-center justify-center">
                                {/* SVG Circular Progress */}
                                <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-800/80" />
                                    <circle 
                                        cx="80" cy="80" r="70" 
                                        stroke="url(#emeraldGradient)" 
                                        strokeWidth="10" 
                                        fill="transparent" 
                                        strokeDasharray={440} 
                                        strokeDashoffset={440 - (440 * rawProgressPct) / 100}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out" 
                                    />
                                    <defs>
                                        <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#34d399" />
                                            <stop offset="100%" stopColor="#059669" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400">{readingProgressPct}%</span>
                                    <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase mt-1">Completed</span>
                                </div>
                            </div>
                        </div>

                        <div className="z-10 bg-black/60 rounded-xl p-5 border border-zinc-800/50 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mb-1">Articles Read</p>
                                    <p className="font-black text-zinc-200 text-lg leading-none">{completedChapters.length} <span className="text-sm font-medium text-zinc-600">/ {totalConstitutionParts}</span></p>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                                        {totalConstitutionParts - completedChapters.length} LEFT
                                    </div>
                                </div>
                            </div>
                            <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-gradient-to-r from-emerald-500 to-green-400 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${rawProgressPct}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Highlights Section */}
                <div className="lg:col-span-2">
                    <div className="glass-card rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-zinc-100">My Highlights</h3>
                            <button onClick={() => navigate('/constitution')} className="text-sm text-amber-500 hover:text-amber-500 font-medium">Add More →</button>
                        </div>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                            {highlights.length === 0 ? (
                                <div className="text-center py-8 text-zinc-400">No highlights yet. Start reading the Constitution!</div>
                            ) : (
                                highlights.slice(0, 10).map((h, i) => {
                                    let styleWrapper = "bg-zinc-800/50 border-amber-500/30";
                                    let icon = "🖊️ ";
                                    let contentStyle = {};

                                    if (h.type === 'bookmark') {
                                        styleWrapper = "bg-zinc-900 border-amber-500 shadow-sm";
                                        icon = "🔖 ";
                                        contentStyle = { fontWeight: '500' };
                                    } else if (h.type === 'underline') {
                                        styleWrapper = "bg-zinc-900 border-zinc-700 shadow-sm";
                                        contentStyle = { textDecoration: 'underline', textDecorationColor: '#f59e0b', textDecorationStyle: 'wavy' };
                                    } else if (h.type === 'doodle') {
                                        styleWrapper = "bg-zinc-900 border-zinc-800 shadow-sm";
                                        contentStyle = { backgroundColor: h.color, padding: '2px 4px', borderRadius: '4px' };
                                    }

                                    return (
                                        <div key={i} className={`p-4 rounded-xl border flex items-start justify-between gap-4 ${styleWrapper}`}>
                                            <div>
                                                <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
                                                    {icon}{h.highlight_article}
                                                </span>
                                                <p className="mt-2 text-zinc-200 text-sm line-clamp-2" style={contentStyle}>"{h.highlight_text}"</p>
                                            </div>
                                            <button onClick={() => handleDeleteHighlight(h._id)} className="text-zinc-400 hover:text-red-500 transition-colors shrink-0">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Quiz History */}
                <div className="lg:col-span-1">
                    <div className="glass-card rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-zinc-100">Quiz History</h3>
                            <button onClick={() => navigate('/quizer')} className="text-sm text-amber-500 hover:text-amber-500 font-medium">Take Quiz →</button>
                        </div>
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                            {quizzes.length === 0 ? (
                                <div className="text-center py-8 text-zinc-400">No quizzes taken yet.</div>
                            ) : (
                                quizzes.slice(0, 10).map((q, i) => {
                                    const pct = Math.round((q.quiz_score / q.quiz_total) * 100);
                                    const colorClass = pct >= 70 ? 'bg-emerald-100 text-emerald-600' : pct >= 40 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600';
                                    const diffClass = DIFFICULTY_COLORS[q.difficulty] || DIFFICULTY_COLORS.medium;
                                    return (
                                        <div key={i} className="flex items-center justify-between p-3 bg-black rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium text-zinc-200">{pct}/100 Score</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-xs text-zinc-400">{new Date(q.quiz_date).toLocaleDateString()}</p>
                                                    {q.difficulty && (
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${diffClass}`}>
                                                            {q.difficulty}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
                                                <span className="text-sm font-bold">{pct}%</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Feedback Section */}
                <div className="lg:col-span-3 mt-4">
                    <div className="glass-card rounded-2xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-zinc-100 mb-2">Provide Feedback</h3>
                        <p className="text-sm text-zinc-400 mb-4">Let the administrator know your thoughts or report issues.</p>
                        <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-4">
                            <textarea 
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                placeholder="Write your feedback here..."
                                className="w-full h-24 px-4 py-3 border border-zinc-800 rounded-xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 outline-none transition-all"
                                required
                            />
                            {feedbackStatus && (
                                <div className={`text-sm px-4 py-2 rounded-lg font-medium ${
                                    feedbackStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                                }`}>
                                    {feedbackStatus.msg}
                                </div>
                            )}
                            <div className="flex justify-end">
                                <button type="submit" disabled={isSubmittingFeedback || !feedbackText.trim()} className="px-6 py-2 bg-black text-white font-bold rounded-xl hover:bg-zinc-900 disabled:opacity-50 transition-all shadow-lg">
                                    {isSubmittingFeedback ? 'Submitting...' : 'Send Feedback'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;



