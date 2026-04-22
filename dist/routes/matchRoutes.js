const express = require('express');
const router = express.Router();
const db = require('../utils/mockDb');
const { calculateStandings } = require('../utils/rankingEngine');

// @route   PUT /api/matches/:id
router.put('/:id', (req, res) => {
    const { score1, score2 } = req.body;
    const match = db.matches.find(m => m._id === req.params.id);
    
    if (!match) return res.status(404).json({ msg: 'Match not found' });
    
    match.score1 = score1;
    match.score2 = score2;
    match.status = 'completed';
    match.playedAt = Date.now();
    
    res.json(match);
});

// @route   GET /api/matches/tournament/:id
router.get('/tournament/:id', (req, res) => {
    const matches = db.matches.filter(m => m.tournamentId === req.params.id);
    res.json(matches);
});

// @route   GET /api/matches/tournament/:id/standings
router.get('/tournament/:id/standings', async (req, res) => {
    try {
        const standings = await calculateStandings(req.params.id);
        res.json(standings);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
