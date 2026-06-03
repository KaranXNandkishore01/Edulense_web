import React, { useState } from 'react';
import { authAPI } from '../api';

const AuthModals = ({ type, onClose, onSwitch, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (type === 'signup' && password !== confirm) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        setError('');

        try {
            let res;
            if (type === 'login') {
                res = await authAPI.login(email, password);
            } else {
                res = await authAPI.register(email, password);
            }
            onSuccess(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
                <div className="relative glass-card rounded-2xl p-8 max-w-md w-full shadow-2xl fade-in">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-zinc-100">{type === 'login' ? 'Welcome Back!' : 'Create Account'}</h3>
                        <p className="text-zinc-400">{type === 'login' ? 'Login to access your highlights' : 'Join EduLense and start learning'}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-200 mb-2">Email</label>
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none" placeholder="your@email.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-200 mb-2">Password</label>
                            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none" placeholder="••••••••" />
                        </div>
                        {type === 'signup' && (
                            <div>
                                <label className="block text-sm font-medium text-zinc-200 mb-2">Confirm Password</label>
                                <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full px-4 py-3 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none" placeholder="••••••••" />
                            </div>
                        )}

                        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                        <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg transition-all">
                            {loading ? 'Processing...' : (type === 'login' ? 'Login' : 'Create Account')}
                        </button>
                    </form>

                    <p className="text-center text-zinc-400 mt-6">
                        {type === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <button onClick={onSwitch} className="text-violet-600 font-medium hover:underline">{type === 'login' ? 'Sign Up' : 'Login'}</button>
                    </p>

                    <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-zinc-800 rounded-lg transition-colors text-xl font-bold">×</button>
                </div>
            </div>
        </div>
    );
};

export default AuthModals;


