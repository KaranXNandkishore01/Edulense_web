const mongoose = require('mongoose');

const highlightSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    highlight_text: {
        type: String,
        required: true
    },
    highlight_article: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['star', 'underline', 'doodle', 'highlight', 'bookmark'],
        default: 'highlight'
    },
    color: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Highlight', highlightSchema);
