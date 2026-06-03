const mongoose = require('mongoose');

const constitutionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['preamble', 'part', 'article'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    part: {
        type: String,
        default: ''
    },
    articleNumber: {
        type: String, // e.g., "1", "21A"
        default: ''
    },
    content: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    embedding: {
        type: [Number],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Constitution', constitutionSchema);
