const mongoose = require('mongoose');

const TournamentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    joinCode: { type: String, required: true, unique: true },
    maxPlayers: { type: Number, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['open', 'active', 'finished'], default: 'open' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tournament', TournamentSchema);
