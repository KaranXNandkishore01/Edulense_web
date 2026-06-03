import React from 'react';

const features = [
    {
        icon: (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
        gradient: 'from-amber-500 to-amber-400',
        glow: 'rgba(79, 70, 229, 0.3)',
        border: 'hover:border-amber-500/50',
        accent: 'text-amber-400',
        bg: 'bg-indigo-900/40',
        title: 'Complete Constitution',
        desc: 'Access every article, schedule, and amendment of the Indian Constitution in a beautifully formatted reader.',
        badge: '448 Articles',
    },
    {
        icon: (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ),
        gradient: 'from-amber-500 to-amber-400',
        glow: 'rgba(251, 191, 36, 0.3)',
        border: 'hover:border-amber-500/50',
        accent: 'text-amber-400',
        bg: 'bg-amber-900/40',
        title: 'Smart Star Points',
        desc: 'Star key passages as you read. These become the focus of your AI quizzes — perfect for targeted revision.',
        badge: 'Personalised',
    },
    {
        icon: (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
        gradient: 'from-indigo-400 to-blue-500',
        glow: 'rgba(129, 140, 248, 0.3)',
        border: 'hover:border-indigo-400/50',
        accent: 'text-amber-300',
        bg: 'bg-indigo-900/30',
        title: 'Adaptive AI Quizzes',
        desc: 'Gemini 2.5 generates 10 fresh questions from your actual reading — difficulty adapts to your quiz scores.',
        badge: 'Gemini 2.5 Flash',
    },
    {
        icon: (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        gradient: 'from-slate-600 to-slate-500',
        glow: 'rgba(71,85,105,.3)',
        border: 'hover:border-slate-500/50',
        accent: 'text-zinc-300',
        bg: 'bg-zinc-900',
        title: 'Progress Dashboard',
        desc: 'Track every quiz with an interactive chart, see your difficulty evolution, and monitor starred highlights.',
        badge: 'Live Charts',
    },
];

const Features = () => {
    return (
        <section className="py-28 relative bg-black overflow-hidden border-t border-zinc-800/50">


            <div className="max-w-screen-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-20 fade-in">
                    <span className="inline-block px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-300 text-sm font-bold tracking-wide mb-6 shadow-sm">
                        Why EduLense
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-tight">
                        Everything you need to{' '}
                        <span className="text-gradient">master</span> the Constitution
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-medium">
                        A complete learning ecosystem — from reading to retention — powered by AI.
                    </p>
                </div>

                {/* Feature cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className={`group bg-zinc-900/40 backdrop-blur-xl rounded-3xl p-8 border border-zinc-800/50 transition-all duration-500 ${f.border} hover:-translate-y-2 shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] fade-in-up`}
                            style={{ animationDelay: `${i * 0.1}s`, ['--glow-color']: f.glow }}
                        >
                            {/* Icon */}
                            <div className={`w-12 h-12 bg-gradient-to-br ${f.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300 shadow-md`}
                                style={{ boxShadow: `0 4px 14px ${f.glow}` }}>
                                {f.icon}
                            </div>

                            {/* Badge */}
                            <span className={`inline-block px-2.5 py-0.5 ${f.bg} ${f.accent} text-[11px] font-bold rounded-full border border-current/20 mb-4`}>
                                {f.badge}
                            </span>

                            <h3 className="text-lg font-bold text-white mb-2.5">{f.title}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed font-medium">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;

