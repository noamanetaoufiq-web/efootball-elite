const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const { calculateStandings } = require('../utils/rankingEngine');

// @route   PUT /api/matches/:id
router.put('/:id', async (req, res) => {
    const { score1, score2 } = req.body;
    try {
        const match = await Match.findById(req.params.id);
        if (!match) return res.status(404).json({ msg: 'Match not found' });
        
        match.score1 = score1;
        match.score2 = score2;
        match.status = 'finished';
        
        await match.save();

        // AUTO-FINAL LOGIC
        if (match.type === 'knockout' && match.stageLabel === 'Semi-Final') {
            const allSemis = await Match.find({ 
                tournamentId: match.tournamentId, 
                stageLabel: 'Semi-Final' 
            });

            if (allSemis.every(m => m.status === 'finished')) {
                // Both semis done, create final
                const winners = allSemis.map(m => {
                    return m.score1 > m.score2 ? m.player1 : m.player2;
                });

                const finalMatch = new Match({
                    tournamentId: match.tournamentId,
                    player1: winners[0],
                    player2: winners[1],
                    type: 'knockout',
                    stageLabel: 'Final'
                });
                await finalMatch.save();
            }
        }

        res.json(match);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET /api/matches/tournament/:id
router.get('/tournament/:id', async (req, res) => {
    try {
        const matches = await Match.find({ tournamentId: req.params.id })
            .populate('player1')
            .populate('player2');
        res.json(matches);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
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
