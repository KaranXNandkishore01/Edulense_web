const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Required in main server file for simplicity: (no JWT in basic implementation, keeping it session-less basic for porting)
// To keep it simple matching the frontend logic which just uses email directly - we'll implement a simple login.
// Since the frontend uses a simple "mock user" object, we'll return the user object.

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check existing
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ _id: newUser._id, email: newUser.email, role: newUser.role });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        res.json({ _id: user._id, email: user.email, role: user.role });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
