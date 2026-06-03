import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizzesAPI, progressAPI } from '../api';

// ── Difficulty config ──────────────────────────────────────────────────────
const DIFFICULTY_CONFIG = {
    easy: {
        label: 'Easy',
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        bar: 'from-emerald-400 to-teal-400',
        icon: '🟢',
        desc: 'Foundational questions to build confidence',
    },
    medium: {
        label: 'Medium',
        color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        bar: 'from-amber-400 to-orange-400',
        icon: '🟡',
        desc: 'Balanced conceptual and recall questions',
    },
    hard: {
        label: 'Hard',
        color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        bar: 'from-rose-500 to-pink-500',
        icon: '🔴',
        desc: 'Advanced application and edge-case questions',
    },
};

// ── Difficulty Badge Component ─────────────────────────────────────────────
const DifficultyBadge = ({ difficulty, size = 'sm' }) => {
    const cfg = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
    return (
        <span
            className={`inline-flex items-center gap-1.5 border font-semibold rounded-full ${cfg.color} ${
                size === 'lg' ? 'px-5 py-2 text-base' : 'px-3 py-1 text-xs'
            }`}
        >
            {cfg.icon} {cfg.label}
        </span>
    );
};

const Quizer = ({ currentUser, showNotification, onRequestLogin }) => {
    const [quizState, setQuizState] = useState('start'); // start | loading | playing | results
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [difficulty, setDifficulty] = useState('medium');
    const [chaptersCount, setChaptersCount] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');
    const [timeLimit, setTimeLimit] = useState(0); // 0 = unlimited
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const navigate = useNavigate();

    // ── Start quiz: fetch progress then request adaptive questions ────────
    const startQuiz = async () => {
        if (!currentUser) {
            showNotification('Please log in to take the quiz', 'info');
            if (onRequestLogin) onRequestLogin();
            return;
        }

        setQuizState('loading');
        setErrorMsg('');

        try {
            const res = await quizzesAPI.generateQuestions(currentUser._id);

            const { questions, difficulty: diff, completedChapters } = res.data;

            if (!questions || questions.length === 0) {
                throw new Error('No questions returned');
            }

            setQuizQuestions(questions);
            setDifficulty(diff || 'medium');
            setChaptersCount(completedChapters?.length || 0);
            setScore(0);
            setCurrentIndex(0);
            setQuizState('playing');
            setSelectedOption(null);
            setShowFeedback(false);
            
            if (timeLimit > 0) {
                setTimeLeft(timeLimit * 60);
                setTimerActive(true);
            } else {
                setTimerActive(false);
            }
        } catch (err) {
            console.error('Quiz generation failed:', err);
            setErrorMsg(
                err?.response?.data?.details ||
                    'Could not generate questions. Please try again.'
            );
            setQuizState('start');
        }
    };

    // ── Timer Effect ──────────────────────────────────────────────────────
    React.useEffect(() => {
        let interval = null;
        if (quizState === 'playing' && timerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        handleFinishQuiz(score, currentIndex + 1); // Submits what we have so far
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [quizState, timerActive, timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleFinishQuiz = async (finalScore, totalQuestionsAttempted) => {
        setScore(finalScore);
        setQuizState('results');
        setTimerActive(false);
        if (currentUser) {
            try {
                await quizzesAPI.saveScore({
                    user: currentUser._id,
                    quiz_score: finalScore,
                    quiz_total: totalQuestionsAttempted,
                    difficulty,
                });
            } catch (err) {
                if (typeof showNotification === 'function') {
                    showNotification('Failed to save score', 'error');
                }
            }
        }
    };

    // ── Answer handling ───────────────────────────────────────────────────
    const handleSelectAnswer = (idx) => {
        if (selectedOption !== null) return;
        setSelectedOption(idx);
        setShowFeedback(true);
        if (idx === quizQuestions[currentIndex].correct) {
            setScore((s) => s + 1);
        }
    };

    const handleNext = async () => {
        const isCorrect = selectedOption === quizQuestions[currentIndex].correct;
        const finalScore = score + (isCorrect ? 1 : 0);
        
        // Always update score immediately
        if (!isCorrect) {
            // we didn't add it in handleSelectAnswer because we wait for next? Wait, handleSelectAnswer already added +1 to score.
            // Oh, handleSelectAnswer modifies the score state asynchronously. We should trust the calculation here.
            // Wait, looking closely: handleSelectAnswer already did setScore(s => s + 1). 
            // We should NOT add it again here! Let's just use the current score state if it was correct, or we can just pass the correct value to handleFinishQuiz.
        }

        const isLastQuestion = currentIndex >= quizQuestions.length - 1;

        if (isLastQuestion) {
            if (timerActive) {
                // Continuous mode: fetch more questions
                setIsFetchingMore(true);
                try {
                    const res = await quizzesAPI.generateQuestions(currentUser._id);
                    if (res.data.questions && res.data.questions.length > 0) {
                        setQuizQuestions(prev => [...prev, ...res.data.questions]);
                        setCurrentIndex((i) => i + 1);
                        setSelectedOption(null);
                        setShowFeedback(false);
                    } else {
                        // Backend failed to return more
                        handleFinishQuiz(score, currentIndex + 1);
                    }
                } catch(e) {
                    handleFinishQuiz(score, currentIndex + 1);
                }
                setIsFetchingMore(false);
            } else {
                // Normal mode
                handleFinishQuiz(score, currentIndex + 1);
            }
        } else {
            setCurrentIndex((i) => i + 1);
            setSelectedOption(null);
            setShowFeedback(false);
        }
    };

    // ── START SCREEN ──────────────────────────────────────────────────────
    if (quizState === 'start' || quizState === 'loading') {
        const isLoading = quizState === 'loading';
        return (
            <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-full text-amber-500 text-sm font-medium mb-4">
                        🤖 AI-Powered Adaptive Quiz
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mb-4">
                        Test Your Knowledge
                    </h2>
                    <p className="text-zinc-300 max-w-xl mx-auto">
                        Questions are tailored to your reading progress and past performance.
                    </p>
                </div>

                <div className="glass-card rounded-2xl p-10 shadow-lg text-center">
                    <div className="space-y-6 mb-10">
                        {/* Feature cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                            <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                                <div className="text-2xl mb-2">📖</div>
                                <h4 className="font-semibold text-zinc-200 text-sm">Progress-Based</h4>
                                <p className="text-xs text-zinc-400 mt-1">Questions drawn from chapters you've studied</p>
                            </div>
                            <div className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
                                <div className="text-2xl mb-2">🎯</div>
                                <h4 className="font-semibold text-zinc-200 text-sm">Adaptive Difficulty</h4>
                                <p className="text-xs text-zinc-400 mt-1">Gets harder as you improve, easier when you struggle</p>
                            </div>
                            <div className="p-4 bg-zinc-800/50 rounded-xl border border-amber-500/30">
                                <div className="text-2xl mb-2">⭐</div>
                                <h4 className="font-semibold text-zinc-200 text-sm">Starred Focus</h4>
                                <p className="text-xs text-zinc-400 mt-1">Prioritises concepts you've starred while reading</p>
                            </div>
                        </div>
                    </div>

                    {/* Error message */}
                    {errorMsg && (
                        <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-xl text-red-400 text-sm text-left">
                            ⚠️ {errorMsg}
                        </div>
                    )}
                    
                    {/* Timer Selection */}
                    <div className="mb-8 p-4 bg-zinc-900 rounded-xl border border-zinc-800 text-left">
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">Practice Timer (Optional)</label>
                        <select 
                            value={timeLimit} 
                            onChange={(e) => setTimeLimit(Number(e.target.value))}
                            className="w-full bg-black/40 border border-zinc-700 text-zinc-100 px-4 py-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                        >
                            <option value={0}>No Timer (Standard 5 Questions)</option>
                            <option value={2}>2 Minutes Continuous Practice</option>
                            <option value={5}>5 Minutes Continuous Practice</option>
                            <option value={10}>10 Minutes Continuous Practice</option>
                        </select>
                        <p className="text-xs text-zinc-500 mt-2">Continuous practice will keep loading questions until the timer runs out!</p>
                    </div>

                    <button
                        id="start-quiz-btn"
                        onClick={startQuiz}
                        disabled={isLoading}
                        className="px-10 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-3">
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Generating Your Personalised Quiz…
                            </span>
                        ) : (
                            '🚀 Start Quiz'
                        )}
                    </button>
                    {!currentUser && (
                        <p className="mt-4 text-sm text-zinc-400">
                            You need to be{' '}
                            <button
                                onClick={() => { if (onRequestLogin) onRequestLogin(); }}
                                className="text-amber-500 font-medium hover:underline"
                            >
                                logged in
                            </button>{' '}
                            to take the quiz.
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // ── RESULTS SCREEN ────────────────────────────────────────────────────
    if (quizState === 'results') {
        const finalScore = typeof score === 'number' ? score : 0;
        // currentIndex + 1 is the total attempted because when finished, currentIndex is the last index attempted.
        // wait, if we are on index 0 and answer 1, currentIndex+1 = 1. So it's correct.
        const totalAttempted = currentIndex + 1;
        const percentage = Math.round((finalScore / totalAttempted) * 100);
        const cfg = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;

        let feedbackMsg = '';
        if (percentage >= 80) feedbackMsg = '🎉 Excellent work! You\'re mastering the Constitution.';
        else if (percentage >= 60) feedbackMsg = '👍 Good effort! Keep studying to improve further.';
        else feedbackMsg = '📚 Keep practising — every quiz makes you stronger!';

        return (
            <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="glass-card rounded-2xl shadow-lg p-12">
                    <div className="text-5xl mb-4">
                        {percentage >= 80 ? '🏆' : percentage >= 60 ? '🎯' : '📖'}
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-100 mb-2">Quiz Complete!</h3>

                    {/* Difficulty tag */}
                    <div className="flex justify-center mb-6">
                        <DifficultyBadge difficulty={difficulty} size="lg" />
                    </div>

                    {/* Score ring */}
                    <div className="my-6">
                        <p className="text-6xl font-extrabold text-gradient mb-1">{percentage || 0}%</p>
                        <p className="text-zinc-400 text-sm">
                            {finalScore} correct out of {totalAttempted} questions attempted
                        </p>
                    </div>

                    <p className="text-zinc-300 mb-8">{feedbackMsg}</p>

                    {chaptersCount > 0 && (
                        <p className="text-xs text-zinc-400 mb-6">
                            Quiz was generated from {chaptersCount} completed chapter{chaptersCount !== 1 ? 's' : ''}.
                        </p>
                    )}

                    <div className="flex gap-4 justify-center flex-wrap">
                        <button
                            id="retry-quiz-btn"
                            onClick={startQuiz}
                            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => navigate('/constitution')}
                            className="px-6 py-3 border-2 border-amber-500 text-amber-500 font-bold rounded-xl hover:bg-zinc-800/50 transition-all"
                        >
                            Study More
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── PLAYING SCREEN ────────────────────────────────────────────────────
    const question = quizQuestions[currentIndex];

    if (!question) {
        return (
            <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="glass-card rounded-2xl p-8 shadow-lg">
                    <h3 className="text-xl font-semibold text-zinc-100 mb-6">
                        No questions available.
                    </h3>
                    <button
                        onClick={() => setQuizState('start')}
                        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const cfg = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
    const progressPct = ((currentIndex + 1) / quizQuestions.length) * 100;

    return (
        <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-card rounded-2xl p-8 shadow-lg">

                {/* Header row */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <span className="text-sm font-medium text-zinc-400">
                        {timerActive ? `Question ${currentIndex + 1}` : `Question ${currentIndex + 1} of ${quizQuestions.length}`}
                    </span>
                    <div className="flex items-center gap-3">
                        {timerActive && (
                            <span className={`px-4 py-1.5 font-bold rounded-lg text-sm flex items-center gap-2 ${timeLeft < 30 ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-zinc-800 text-zinc-300'}`}>
                                ⏳ {formatTime(timeLeft)}
                            </span>
                        )}
                        <DifficultyBadge difficulty={difficulty} />
                        <span className="px-4 py-1.5 bg-amber-500/10 text-amber-500 font-semibold rounded-lg text-sm">
                            Score: {score}
                        </span>
                    </div>
                </div>

                {/* Progress bar (only for non-timer mode) */}
                {!timerActive && (
                    <div className="w-full bg-zinc-800 rounded-full h-2.5 mb-8">
                        <div
                            className={`bg-gradient-to-r ${cfg.bar} h-2.5 rounded-full transition-all duration-500`}
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                )}

                {/* Article tag */}
                {question.article && (
                    <div className="mb-3">
                        <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-800 text-zinc-400 rounded-full">
                            📜 {question.article}
                        </span>
                    </div>
                )}

                {/* Question */}
                <h3 className="text-xl font-semibold text-zinc-100 mb-6">
                    {question.question}
                </h3>

                {/* Options */}
                <div className="space-y-3">
                    {question.options.map((opt, idx) => {
                        let btnClass =
                            'quiz-option w-full text-left p-4 border-2 border-zinc-800 rounded-xl transition-all ';
                        if (selectedOption !== null) {
                            if (idx === question.correct) btnClass += 'correct ';
                            else if (idx === selectedOption) btnClass += 'wrong ';
                            else btnClass += 'opacity-40 ';
                        } else {
                            btnClass += 'hover:border-amber-500/50 hover:bg-zinc-800/50 cursor-pointer';
                        }
                        return (
                            <button
                                id={`option-${idx}`}
                                key={idx}
                                disabled={selectedOption !== null}
                                onClick={() => handleSelectAnswer(idx)}
                                className={btnClass}
                            >
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-zinc-800 text-zinc-300 rounded-lg text-sm font-bold mr-3 shrink-0">
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                {opt}
                            </button>
                        );
                    })}
                </div>

                {/* Feedback + Explanation */}
                {showFeedback && (
                    <div
                        className={`mt-6 p-4 rounded-xl border ${
                            selectedOption === question.correct
                                ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400'
                                : 'bg-rose-900/20 border-rose-500/30 text-rose-400'
                        }`}
                    >
                        <p className="font-semibold mb-1">
                            {selectedOption === question.correct
                                ? '✅ Correct!'
                                : `❌ Incorrect. Correct answer: ${question.options[question.correct]}`}
                        </p>
                        {question.explanation && (
                            <p className="text-sm text-zinc-300 mt-1">
                                💡 {question.explanation}
                            </p>
                        )}
                    </div>
                )}

                {/* Next button */}
                {selectedOption !== null && (
                    <button
                        id="next-question-btn"
                        onClick={handleNext}
                        disabled={isFetchingMore}
                        className="mt-8 w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {isFetchingMore ? 'Loading more questions...' : (!timerActive && currentIndex === quizQuestions.length - 1) ? '🏁 See Results' : 'Next Question →'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Quizer;



