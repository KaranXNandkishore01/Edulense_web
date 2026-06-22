import React, { useState } from 'react';
import { constitutionAPI } from '../api';

const DigiLawyerBubble = ({ showNotification }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([
        { role: 'assistant', content: 'Hello! I am **DigiLawyer**. I am here to help you understand the Constitution of India, explain laws, and answer your legal queries. How can I assist you today?' }
    ]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;
        
        const userMessage = { role: 'user', content: chatInput.trim() };
        const newMessages = [...chatMessages, userMessage];
        setChatMessages(newMessages);
        setChatInput('');
        setIsSearching(true);
        
        try {
            const res = await constitutionAPI.searchAI(newMessages);
            let botReply = res.data.answer;
            if (res.data.sources && res.data.sources.length > 0) {
                botReply += "\n\n**Sources:**\n" + res.data.sources.map(s => `- ${s.type === 'article' ? 'Article ' + s.articleNumber : s.title}`).join("\n");
            }
            setChatMessages([...newMessages, { role: 'assistant', content: botReply }]);
        } catch (err) {
            if (showNotification) showNotification('Failed to get AI response', 'error');
            setChatMessages([...newMessages, { role: 'assistant', content: "I'm sorry, I encountered an error while analyzing the Constitution." }]);
        }
        setIsSearching(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <div className={`bg-zinc-950 border-zinc-800 shadow-2xl overflow-hidden flex flex-col fade-in ${isFullScreen ? 'fixed inset-0 w-full h-full z-[100] rounded-none' : 'rounded-xl border w-[350px] sm:w-[400px] h-[500px] mb-4 relative z-50'}`}>
                    {/* Chat Header */}
                    <div className="bg-indigo-900/90 border-b border-zinc-800 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-600/20">
                                ⚖️
                            </div>
                            <div>
                                <h3 className="font-bold text-zinc-100">DigiLawyer</h3>
                                <p className="text-xs text-indigo-300">AI Constitutional Expert</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsFullScreen(!isFullScreen)} className="text-zinc-300 hover:text-white transition-colors p-1" title={isFullScreen ? "Exit Full Screen" : "Full Screen"}>
                                {isFullScreen ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg> // simple exit icon
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                )}
                            </button>
                            <button onClick={() => { setIsOpen(false); setIsFullScreen(false); }} className="text-zinc-300 hover:text-white transition-colors p-1" title="Close">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>
                    
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {chatMessages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-amber-500 text-black rounded-tr-sm' : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-sm'}`}>
                                    {msg.role === 'assistant' && <div className="text-xs text-indigo-400 mb-1 font-semibold flex items-center gap-1">⚖️ DigiLawyer</div>}
                                    {msg.role === 'user' && <div className="text-xs text-amber-900 mb-1 font-semibold">You</div>}
                                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                        {msg.content.split('**').map((text, i) => i % 2 === 1 ? <strong key={i} className={msg.role === 'user' ? 'text-black font-black' : 'text-white'}>{text}</strong> : text)}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isSearching && (
                            <div className="flex justify-start">
                                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-sm p-4 text-zinc-400 flex items-center gap-2">
                                    <svg className="w-4 h-4 animate-spin text-indigo-500" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75"></path></svg>
                                    <span className="text-sm">DigiLawyer is typing...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-zinc-900 border-t border-zinc-800">
                        <div className="relative flex items-center">
                            <input 
                                type="text" 
                                placeholder="Ask DigiLawyer a question..." 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSendMessage();
                                }}
                                className="w-full bg-black border border-zinc-700 text-zinc-100 px-4 py-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors pr-12"
                            />
                            <button 
                                onClick={handleSendMessage}
                                disabled={isSearching || !chatInput.trim()}
                                className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-transform hover:scale-105"
            >
                {isOpen ? (
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <span className="text-3xl">⚖️</span>
                )}
            </button>
        </div>
    );
};

export default DigiLawyerBubble;
