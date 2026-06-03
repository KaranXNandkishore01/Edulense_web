import React from 'react';

const About = () => {
    return (
        <div className="py-20 max-w-screen-2xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">About EduLense</h2>
                <p className="text-zinc-300 max-w-2xl mx-auto">Empowering students to understand and appreciate the Indian Constitution</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <div className="glass-card rounded-2xl p-8 shadow-lg">
                        <h3 className="text-2xl font-bold text-zinc-100 mb-4">Our Mission</h3>
                        <p className="text-zinc-300 mb-6">EduLense was created with a simple yet powerful mission: to make the Indian Constitution accessible and engaging for every student. We believe that understanding the Constitution is not just an academic requirement but a fundamental right and responsibility of every citizen.</p>
                        <p className="text-zinc-300 mb-6">Our platform combines modern technology with thoughtful pedagogy to create an immersive learning experience. From smart highlighting to AI-powered quizzes, every feature is designed to enhance your understanding and retention.</p>
                        <div className="flex gap-4">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-violet-600">10K+</div>
                                <div className="text-sm text-zinc-400">Active Students</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-cyan-600">50K+</div>
                                <div className="text-sm text-zinc-400">Quizzes Taken</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-emerald-600">95%</div>
                                <div className="text-sm text-zinc-400">Satisfaction Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-zinc-100 mb-1">Comprehensive Coverage</h4>
                            <p className="text-zinc-300 text-sm">Complete Indian Constitution with all 448 articles, 25 parts, and 12 schedules.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-zinc-100 mb-1">AI-Powered Learning</h4>
                            <p className="text-zinc-300 text-sm">Smart quizzes that adapt to your learning pace and highlight weak areas.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-zinc-100 mb-1">Personalized Experience</h4>
                            <p className="text-zinc-300 text-sm">Track your progress, save highlights, and pick up where you left off.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;


