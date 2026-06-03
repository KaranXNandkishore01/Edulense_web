const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST submit feedback (Student)
router.post('/', async (req, res) => {
    try {
        const { user, text } = req.body;
        if (!user || !text) {
            return res.status(400).json({ error: 'User and text are required' });
        }
        
        const newFeedback = new Feedback({ user, text });
        await newFeedback.save();
        res.status(201).json(newFeedback);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET all feedback (Admin)
router.get('/', async (req, res) => {
    try {
        // Populate the user email to display in admin panel
        const feedbacks = await Feedback.find().populate('user', 'email').sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
