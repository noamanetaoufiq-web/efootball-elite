const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    efootballId: { type: String, required: true, unique: true },
    teamName: { type: String, required: true },
    teamLogo: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/805/805404.png' }, // Default soccer icon
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
