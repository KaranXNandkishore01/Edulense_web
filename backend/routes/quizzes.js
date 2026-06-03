const express = require('express');
const router = express.Router();
const QuizScore = require('../models/QuizScore');
const Highlight = require('../models/Highlight');
const Constitution = require('../models/Constitution');
const User = require('../models/User');
const nlpModel = require('../utils/nlpModel');

// ─── Helper: Compute difficulty from recent quiz history ─────────────────────
function computeDifficulty(recentScores) {
    if (!recentScores || recentScores.length === 0) return 'medium';

    const avg =
        recentScores.reduce((sum, s) => sum + s.quiz_score / s.quiz_total, 0) /
        recentScores.length;

    if (avg >= 0.8) return 'hard';
    if (avg >= 0.5) return 'medium';
    return 'easy';
}

function cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function getEmbedding(text) {
    try {
        const response = await fetch('http://127.0.0.1:11434/api/embeddings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'nomic-embed-text',
                prompt: text
            })
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data.embedding;
    } catch (err) {
        return null;
    }
}

// ─── Helper: Build difficulty instructions for the prompt ────────────────────
function difficultyInstructions(difficulty) {
    switch (difficulty) {
        case 'hard':
            return `The student scores above 80% consistently. Generate HARD questions: focus on application, edge-case interpretations, amendment-specific details, cross-article relationships, and uncommon provisions. Avoid straightforward recall questions.`;
        case 'easy':
            return `The student is struggling (below 50%). Generate EASY questions: focus on fundamental recall, well-known articles, basic definitions, and the most prominent constitutional provisions. Keep language simple and unambiguous.`;
        default:
            return `The student is at an intermediate level (50–80%). Generate MEDIUM difficulty questions: mix conceptual understanding with recall, include questions on important articles and their scope, and avoid trivially easy or highly obscure questions.`;
    }
}

// ─── Get all quiz scores for a user ─────────────────────────────────────────
router.get('/:userId', async (req, res) => {
    try {
        const quizzes = await QuizScore.find({ user: req.params.userId }).sort({ quiz_date: -1 });
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ─── Save a quiz score ────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
    try {
        const { user, quiz_score, quiz_total, difficulty } = req.body;

        const newQuizScore = new QuizScore({
            user,
            quiz_score,
            quiz_total,
            difficulty: difficulty || 'medium',
        });

        await newQuizScore.save();
        res.status(201).json(newQuizScore);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ─── Generate adaptive questions using Gemini + student progress ─────────────
router.post('/generate', async (req, res) => {
    console.log('📚 Question generation request received');
    try {
        const { userId } = req.body || {};

        // ── 1. Fetch student data from DB ─────────────────────────────────
        let completedChapters = [];
        let recentScores = [];
        let highlightedTopics = [];
        let constitutionContent = [];

        if (userId) {
            // Completed chapters (authoritative from User model)
            const user = await User.findById(userId).select('completedChapters');
            if (user) {
                completedChapters = user.completedChapters || [];
            }

            // Last 5 quiz scores to compute difficulty
            recentScores = await QuizScore.find({ user: userId })
                .sort({ quiz_date: -1 })
                .limit(5)
                .select('quiz_score quiz_total difficulty');

            // Highlights and bookmarks as priority signals for quiz generation
            const highlightsQuery = await Highlight.find({ user: userId, type: { $in: ['highlight', 'bookmark'] } })
                .sort({ createdAt: -1 })
                .limit(20)
                .select('highlight_text highlight_article');
            highlightedTopics = highlightsQuery.map(s => ({
                text: s.highlight_text,
                article: s.highlight_article,
            }));
        }

        // ── 2. Compute adaptive difficulty ────────────────────────────────
        const difficulty = computeDifficulty(recentScores);
        console.log(`🎯 Difficulty: ${difficulty} (based on ${recentScores.length} recent scores)`);

        console.log('🤖 Generating questions via local NLP model...');
        const questions = nlpModel.generateQuestions(5, difficulty, completedChapters);
        
        if (!questions || questions.length === 0) {
            throw new Error('NLP model failed to generate questions. Model may not be initialized properly.');
        }

        console.log(`✅ Generated ${questions.length} questions at ${difficulty} difficulty`);

        res.json({
            questions: questions,
            difficulty: difficulty,
            completedChapters,
            totalArticlesUsed: questions.length,
        });
    } catch (err) {
        console.error('❌ Question Generation Error:', err.message || err);
        res.status(500).json({
            error: 'Failed to generate questions.',
            details: err.message,
        });
    }
});

module.exports = router;
