const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST mark chapter as complete
router.post('/mark-complete', async (req, res) => {
    try {
        const { userId, chapterId } = req.body;
        if (!userId || !chapterId) {
            return res.status(400).json({ error: 'Missing userId or chapterId' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.completedChapters.includes(chapterId)) {
            user.completedChapters.push(chapterId);
            await user.save();
        }

        res.json({ success: true, completedChapters: user.completedChapters });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET user progress
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ completedChapters: user.completedChapters });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
