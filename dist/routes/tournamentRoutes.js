const express = require('express');
const router = express.Router();
const db = require('../utils/mockDb');

// Helper to generate a random 6-character code
const generateJoinCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// @route   POST /api/tournaments
router.post('/', (req, res) => {
    const { name, maxPlayers, ownerId, ownerProfile } = req.body;
    const joinCode = generateJoinCode();
    
    // Auto-join owner and keep full user object ref
    let ownerObj = db.users.find(u => u._id === ownerId);

    // Lazy registration for owner if missing from memory
    if (!ownerObj && ownerProfile) {
        ownerObj = ownerProfile;
        db.users.push(ownerObj);
    }

    const tournament = {
        _id: Date.now().toString(),
        name,
        maxPlayers,
        owner: ownerId,
        joinCode,
        status: 'open',
        participants: ownerObj ? [ownerObj] : [] 
    };
    
    db.tournaments.push(tournament);
    res.json(tournament);
});

// @route   POST /api/tournaments/join
router.post('/join', (req, res) => {
    const { userId, joinCode, userProfile } = req.body;
    const tournament = db.tournaments.find(t => t.joinCode === joinCode.toUpperCase());
    
    if (!tournament) {
        return res.status(404).json({ msg: 'Tournament not found. Check code.' });
    }
    
    if (tournament.participants.length >= tournament.maxPlayers) {
        return res.status(400).json({ msg: 'Tournament is already full' });
    }
    
    if (tournament.participants.some(p => p._id === userId)) {
        return res.status(400).json({ msg: 'You have already joined this event' });
    }
    
    let userObj = db.users.find(u => u._id === userId);
    
    // If user not in current memory but profile is provided (Lazy Registration)
    if (!userObj && userProfile) {
        userObj = userProfile;
        db.users.push(userObj);
    }

    if (userObj) {
        tournament.participants.push(userObj);
    } else {
        return res.status(400).json({ msg: 'User profile missing. Please try logging out and in again.' });
    }

    // AUTO-START LOGIC
    if (tournament.participants.length === tournament.maxPlayers) {
        tournament.status = 'active';

        const players = tournament.participants;
        
        // Simple Round Robin pairing
        for (let i = 0; i < players.length; i++) {
            for (let j = i + 1; j < players.length; j++) {
                db.matches.push({
                    _id: Date.now().toString() + Math.random(),
                    tournamentId: tournament._id,
                    player1: players[i],
                    player2: players[j],
                    score1: 0,
                    score2: 0,
                    status: 'pending'
                });
            }
        }
        
        // Note: I am not shuffling here in mock DB just to keep it simple
    }

    res.json(tournament);
});

// @route   GET /api/tournaments/user/:userId
router.get('/user/:userId', (req, res) => {
    const { userId } = req.params;
    const userTournaments = db.tournaments.filter(t => 
        t.participants.some(p => p._id === userId)
    );
    res.json(userTournaments);
});

// @route   GET /api/tournaments/:joinCode
router.get('/:joinCode', (req, res) => {
    const tournament = db.tournaments.find(t => t.joinCode === req.params.joinCode.toUpperCase());
    if (!tournament) return res.status(404).json({ msg: 'Tournament not found' });
    res.json(tournament);
});

module.exports = router;
