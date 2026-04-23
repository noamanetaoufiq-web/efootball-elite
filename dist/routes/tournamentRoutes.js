const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const Match = require('../models/Match');
const User = require('../models/User');

// Helper to generate a random 6-character code
const generateJoinCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const startTournamentLogic = async (tournament) => {
    if (tournament.status !== 'open') return;
    
    tournament.status = 'active';
    await tournament.save();

    const players = tournament.participants;
    
    // Simple Round Robin pairing
    const matches = [];
    for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
            matches.push({
                tournamentId: tournament._id,
                player1: players[i],
                player2: players[j],
                score1: 0,
                score2: 0,
                status: 'pending'
            });
        }
    }
    if (matches.length > 0) {
        await Match.insertMany(matches);
    }
};

// @route   POST /api/tournaments
router.post('/', async (req, res) => {
    const { name, maxPlayers, ownerId, isOwnerPlaying } = req.body;
    const joinCode = generateJoinCode();
    
    try {
        const tournament = new Tournament({
            name,
            maxPlayers,
            owner: ownerId,
            joinCode,
            status: 'open',
            participants: isOwnerPlaying !== false ? [ownerId] : []
        });
        
        await tournament.save();
        res.json(tournament);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   POST /api/tournaments/join
router.post('/join', async (req, res) => {
    const { userId, joinCode } = req.body;
    
    try {
        const tournament = await Tournament.findOne({ joinCode: joinCode.toUpperCase() });
        
        if (!tournament) {
            return res.status(404).json({ msg: 'Tournament not found. Check code.' });
        }
        
        if (tournament.participants.length >= tournament.maxPlayers) {
            return res.status(400).json({ msg: 'Tournament is already full' });
        }
        
        if (tournament.participants.includes(userId)) {
            return res.status(400).json({ msg: 'You have already joined this event' });
        }
        
        tournament.participants.push(userId);
        
        // AUTO-START LOGIC
        if (tournament.participants.length === tournament.maxPlayers) {
            await startTournamentLogic(tournament);
        } else {
            await tournament.save();
        }

        res.json(tournament);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET /api/tournaments/user/:userId
router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // Find tournaments where user is owner or participant
        const userTournaments = await Tournament.find({
            $or: [
                { owner: userId },
                { participants: userId }
            ]
        }).populate('participants').populate('owner');
        res.json(userTournaments);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET /api/tournaments/:joinCode
router.get('/:joinCode', async (req, res) => {
    try {
        const tournament = await Tournament.findOne({ joinCode: req.params.joinCode.toUpperCase() })
            .populate('participants')
            .populate('owner');
        if (!tournament) return res.status(404).json({ msg: 'Tournament not found' });
        res.json(tournament);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   POST /api/tournaments/start
router.post('/start', async (req, res) => {
    const { tournamentId, userId } = req.body;
    try {
        const tournament = await Tournament.findById(tournamentId);
        
        if (!tournament) return res.status(404).json({ msg: 'Tournament not found' });
        if (tournament.owner.toString() !== userId) return res.status(403).json({ msg: 'Only the host can start the tournament' });
        if (tournament.participants.length < 2) return res.status(400).json({ msg: 'At least 2 players are needed to start' });

        await startTournamentLogic(tournament);
        res.json(tournament);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
