const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/users/register
router.post('/register', async (req, res) => {
    const { name, efootballId, teamName, teamLogo } = req.body;
    
    try {
        // Upsert user: Update if exists by efootballId, otherwise create
        const user = await User.findOneAndUpdate(
            { efootballId },
            { name, teamName, teamLogo },
            { new: true, upsert: true }
        );
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error during registration' });
    }
});

// @route   GET /api/users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
