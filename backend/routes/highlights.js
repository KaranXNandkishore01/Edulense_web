const express = require('express');
const router = express.Router();
const Highlight = require('../models/Highlight');

// Get all highlights for a user
router.get('/:userId', async (req, res) => {
    try {
        const highlights = await Highlight.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(highlights);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create a highlight
router.post('/', async (req, res) => {
    try {
        const { user, highlight_text, highlight_article, type, color } = req.body;

        // Check if user already highlighted
        const existing = await Highlight.findOne({ user, highlight_text, type });
        if (existing) {
            return res.status(400).json({ error: 'Already saved' });
        }

        // Check highlights limit
        const count = await Highlight.countDocuments({ user });
        if (count >= 999) {
            return res.status(400).json({ error: 'Maximum limit reached (999)' });
        }

        const newHighlight = new Highlight({ user, highlight_text, highlight_article, type, color });
        await newHighlight.save();

        res.status(201).json(newHighlight);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a highlight
router.delete('/:id', async (req, res) => {
    try {
        const highlight = await Highlight.findByIdAndDelete(req.params.id);
        if (!highlight) {
            return res.status(404).json({ error: 'Highlight not found' });
        }
        res.json({ message: 'Highlight deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
