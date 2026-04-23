const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
    player1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    player2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    score1: { type: Number, default: 0 },
    score2: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'finished'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Match', MatchSchema);
