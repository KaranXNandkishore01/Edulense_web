import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/edulenselogo.png';

const Footer = () => {
    const navigate = useNavigate();
    return (
        <footer className="bg-zinc-950 text-zinc-50 py-16 border-t border-zinc-800">
            <div className="max-w-screen-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12">
                    <div className="md:col-span-2 pr-0 lg:pr-12">
                        <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="w-9 h-9 flex items-center justify-center overflow-hidden bg-white/5 rounded-xl p-1 border border-white/10">
                                <img src={logo} alt="EduLense" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-zinc-200">EduLense</span>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed font-light">
                            Empowering students to master the Indian Constitution through AI-driven interactive learning.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-zinc-200 mb-5 tracking-wide">Explore</h4>
                        <ul className="space-y-3.5">
                            <li><button onClick={() => navigate('/')} className="text-zinc-400 hover:text-amber-400 text-sm transition-colors font-light">Home</button></li>
                            <li><button onClick={() => navigate('/constitution')} className="text-zinc-400 hover:text-amber-400 text-sm transition-colors font-light">Read Constitution</button></li>
                            <li><button onClick={() => navigate('/quizer')} className="text-zinc-400 hover:text-amber-400 text-sm transition-colors font-light">AI Quizer</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-zinc-200 mb-5 tracking-wide">Company</h4>
                        <ul className="space-y-3.5">
                            <li><button onClick={() => navigate('/about')} className="text-zinc-400 hover:text-amber-400 text-sm transition-colors font-light">About Us</button></li>
                            <li><button onClick={() => navigate('/contact')} className="text-zinc-400 hover:text-amber-400 text-sm transition-colors font-light">Contact</button></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-zinc-900 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-zinc-500 text-xs font-light">© 2026 EduLense. Built for future leaders.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;


