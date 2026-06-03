import React from 'react';
import { useNavigate } from 'react-router-dom';
import constImage from '../assets/constimage.avif';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <div className="relative overflow-hidden min-h-screen flex items-center bg-black">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-amber-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000" />

            <div className="relative max-w-screen-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left — text */}
                    <div className="text-center lg:text-left fade-in">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900/50 backdrop-blur-md border border-zinc-700/50 rounded-full text-zinc-300 text-sm font-semibold mb-8 shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:bg-zinc-800 transition-all duration-300 cursor-default">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                            </span>
                            AI-Powered Constitutional Learning
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 text-white tracking-tight">
                            Master the Indian{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-yellow-600">
                                Constitution
                            </span>
                            {' '}with Confidence
                        </h1>

                        <p className="text-lg sm:text-xl text-zinc-400 mb-10 max-w-xl leading-relaxed font-medium mx-auto lg:mx-0">
                            Read, annotate, and deeply understand every article.
                            Get AI-powered adaptive quizzes that evolve with your progress.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                            <button
                                onClick={() => navigate('/constitution')}
                                className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold rounded-2xl hover:from-amber-400 hover:to-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                Start Reading
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                            <button
                                onClick={() => navigate('/quizer')}
                                className="px-8 py-4 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 text-zinc-200 font-bold rounded-2xl hover:bg-zinc-800 hover:border-zinc-600 hover:text-white shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                Try AI Quiz
                            </button>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
                            {[
                                { val: '448', label: 'Articles' },
                                { val: '12', label: 'Schedules' },
                                { val: '106', label: 'Amendments' },
                            ].map(({ val, label }) => (
                                <div key={label} className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl p-4 text-center hover:bg-zinc-800/60 hover:-translate-y-1 transition-all duration-300">
                                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500">{val}</div>
                                    <div className="text-[10px] text-zinc-400 mt-1 uppercase tracking-widest font-bold">{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — card mockup */}
                    <div className="hidden lg:flex items-center justify-center relative">
                        <div className="relative floating w-full max-w-md">
                            {/* Glow behind card */}
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 rounded-3xl blur-[80px] opacity-20 scale-90" />

                            <div className="relative glass-card-strong rounded-3xl p-6 shadow-2xl border border-zinc-700/50 backdrop-blur-xl">
                                {/* Browser dots */}
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                                    <div className="ml-3 flex-1 h-5 bg-zinc-800/80 rounded-md border border-zinc-700/50" />
                                </div>

                                {/* Image */}
                                <div className="rounded-2xl overflow-hidden border border-zinc-700/50 shadow-inner relative group">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                    <img
                                        src={constImage}
                                        alt="Indian Constitution"
                                        className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>

                                {/* Tags */}
                                <div className="mt-5 flex flex-wrap gap-2">
                                    <span className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/20 hover:bg-indigo-500/20 hover:shadow-[0_0_10px_rgba(99,102,241,0.2)] transition-all cursor-pointer">Article 21</span>
                                    <span className="px-3 py-1.5 bg-zinc-800/50 text-zinc-300 text-xs font-bold rounded-full border border-zinc-700 hover:bg-zinc-700 transition-all cursor-pointer">Fundamental Rights</span>
                                    <span className="px-3 py-1.5 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full border border-amber-500/20 hover:bg-amber-500/20 transition-all cursor-pointer flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        Starred
                                    </span>
                                </div>

                                {/* Quiz preview row */}
                                <div className="mt-6 p-4 bg-zinc-900/80 rounded-2xl border border-zinc-700/50 hover:border-amber-500/50 hover:shadow-[0_8px_16px_-4px_rgba(245,158,11,0.1)] transition-all duration-300 cursor-pointer group">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-md bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                                <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                            </div>
                                            <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">AI Quiz Ready</span>
                                        </div>
                                        <span className="text-xs font-black text-amber-400 flex items-center gap-1.5 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                            Active
                                        </span>
                                    </div>
                                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full w-3/4 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full group-hover:w-full transition-all duration-1000 ease-out" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;

