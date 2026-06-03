import React, { useState } from 'react';

const Contact = ({ showNotification }) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        showNotification('Message sent successfully!', 'success');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="py-20 max-w-screen-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">Contact Us</h2>
                <p className="text-zinc-300 max-w-2xl mx-auto">Have questions or feedback? We'd love to hear from you!</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
                <div className="glass-card rounded-2xl p-8 shadow-lg">
                    <h3 className="text-xl font-bold text-zinc-100 mb-6">Send us a message</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-200 mb-2">Name</label>
                            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none" placeholder="Your name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-200 mb-2">Email</label>
                            <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none" placeholder="your@email.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-200 mb-2">Message</label>
                            <textarea rows="4" required value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none resize-none" placeholder="Your message..."></textarea>
                        </div>
                        <button type="submit" className="w-full py-4 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-bold rounded-xl hover:shadow-lg transition-all">Send Message</button>
                    </form>
                </div>
                <div className="space-y-6">
                    <div className="glass-card rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-zinc-100">Email</h4>
                                <p className="text-zinc-300">support@edulense.com</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-zinc-100">Phone</h4>
                                <p className="text-zinc-300">+91 98765 43210</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-zinc-100">Address</h4>
                                <p className="text-zinc-300">Vijay Nagar, Indore India</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;


