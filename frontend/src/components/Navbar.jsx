import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/edulenselogo.png';

const Navbar = ({ currentUser, onLogout, onLoginClick, onSignupClick }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleNavigation = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ path, label }) => (
        <button
            onClick={() => handleNavigation(path)}
            className={`nav-link text-sm font-medium transition-all duration-200 ${
                isActive(path)
                    ? 'text-white [&::after]:w-full'
                    : 'text-zinc-300 hover:text-white'
            }`}
        >
            {label}
        </button>
    );

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'glass-header shadow-sm' : 'bg-transparent'
        }`}>
            <div className="max-w-screen-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-2.5 cursor-pointer group"
                        onClick={() => handleNavigation('/')}
                    >
                        <div className="w-9 h-9 flex items-center justify-center overflow-hidden bg-white/10 rounded-xl p-1 border border-zinc-800 group-hover:border-amber-400 transition-all shadow-sm">
                            <img src={logo} alt="EduLense" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">EduLense</span>
                    </div>

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-7">
                        <NavLink path="/" label="Home" />
                        <NavLink path="/constitution" label="Constitution" />
                        <NavLink path="/quizer" label="Quizer" />
                        <NavLink path="/about" label="About" />
                        <NavLink path="/contact" label="Contact" />
                        {currentUser?.role === 'admin' && (
                            <NavLink path="/admin" label="Admin Panel" />
                        )}
                    </div>

                    {/* Auth buttons */}
                    <div className="flex items-center gap-3">
                        {!currentUser ? (
                            <div className="hidden md:flex items-center gap-2">
                                <button
                                    onClick={onLoginClick}
                                    className="px-4 py-2 text-sm text-zinc-300 font-medium hover:text-white transition-colors"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={onSignupClick}
                                    className="px-5 py-2 text-sm bg-amber-500 text-slate-900 font-semibold rounded-xl hover:bg-amber-400 hover:shadow-md hover:shadow-amber-500/20 transition-all hover:-translate-y-0.5"
                                >
                                    Sign Up
                                </button>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-3">
                                <button
                                    onClick={() => handleNavigation('/dashboard')}
                                    className="flex items-center gap-2 px-4 py-2 text-sm bg-zinc-900 text-zinc-200 font-medium rounded-xl hover:bg-zinc-800 border border-zinc-800 shadow-sm transition-all"
                                >
                                    <div className="w-6 h-6 rounded-lg bg-amber-900/50 flex items-center justify-center text-xs font-bold text-amber-400 border border-amber-500/30">
                                        {currentUser.email[0].toUpperCase()}
                                    </div>
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => { onLogout(); handleNavigation('/'); }}
                                    className="px-4 py-2 text-sm text-red-400 font-medium hover:bg-red-900/30 rounded-xl transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        )}

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-xl transition-all"
                        >
                            {mobileMenuOpen ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-black border-t border-zinc-800 shadow-lg slide-up absolute w-full">
                    <div className="flex flex-col px-4 py-4 space-y-1">
                        {[['/', 'Home'], ['/constitution', 'Constitution'], ['/quizer', 'Quizer'], ['/about', 'About'], ['/contact', 'Contact']].map(([path, label]) => (
                            <button
                                key={path}
                                onClick={() => handleNavigation(path)}
                                className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                    isActive(path)
                                        ? 'bg-amber-900/50 text-amber-400'
                                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                        {currentUser?.role === 'admin' && (
                            <button onClick={() => handleNavigation('/admin')} className="text-left px-4 py-2.5 rounded-xl text-sm font-medium text-amber-400 hover:bg-amber-900/30 transition-all">
                                Admin Panel
                            </button>
                        )}
                        {currentUser ? (
                            <div className="pt-2 border-t border-zinc-800 mt-2">
                                <button onClick={() => handleNavigation('/dashboard')} className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-200 hover:bg-zinc-900 transition-all">
                                    Dashboard
                                </button>
                                <button onClick={() => { onLogout(); handleNavigation('/'); }} className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/30 transition-all">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2 pt-4 border-t border-zinc-800 mt-2">
                                <button onClick={onLoginClick} className="flex-1 py-2.5 text-sm text-zinc-300 font-medium border border-zinc-800 rounded-xl hover:bg-zinc-900 transition-all">Login</button>
                                <button onClick={onSignupClick} className="flex-1 py-2.5 text-sm bg-amber-500 text-slate-900 font-semibold rounded-xl hover:bg-amber-400 transition-all">Sign Up</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

