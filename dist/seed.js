const mongoose = require('mongoose');
const Tournament = require('./models/Tournament');
const connectDB = require('./config/db');
require('dotenv').config();

const seed = async () => {
    await connectDB();
    
    // Clear existing
    await Tournament.deleteMany({});
    
    const tournament = new Tournament({
        name: "eFootball Ramadan Cup 2026",
        maxPlayers: 16,
        status: 'open'
    });
    
    await tournament.save();
    console.log('Seed: Tournament created successfully');
    process.exit();
};

seed();
