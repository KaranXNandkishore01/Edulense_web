const mongoose = require('mongoose');

const quizScoreSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quiz_score: {
        type: Number,
        required: true
    },
    quiz_total: {
        type: Number,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    quiz_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('QuizScore', quizScoreSchema);
