const express = require('express');
const router = express.Router();
const db = require('../utils/mockDb');

// @route   POST /api/users/register
router.post('/register', (req, res) => {
    const { name, efootballId, teamName, teamLogo } = req.body;
    
    // Check if user exists in mock array
    const existing = db.users.find(u => u.efootballId === efootballId);
    if (existing) {
        return res.status(400).json({ msg: 'Player with this eFootball ID already exists' });
    }

    const user = {
        _id: Date.now().toString(),
        name,
        efootballId,
        teamName,
        teamLogo
    };

    db.users.push(user);
    res.json(user);
});

// @route   GET /api/users
router.get('/', (req, res) => {
    res.json(db.users);
});

module.exports = router;
