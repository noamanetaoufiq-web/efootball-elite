const Tournament = require('../models/Tournament');
const Match = require('../models/Match');

const calculateStandings = async (tournamentId) => {
    const tournament = await Tournament.findById(tournamentId).populate('participants');
    if (!tournament) return [];

    const matches = await Match.find({ 
        tournamentId, 
        status: 'finished' 
    }).populate('player1').populate('player2');
    
    const standings = {};
    
    // Initialize with all participants
    tournament.participants.forEach(user => {
        standings[user._id] = {
            userId: user._id,
            name: user.name,
            teamName: user.teamName,
            teamLogo: user.teamLogo,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0
        };
    });
    
    // Process matches
    matches.forEach(match => {
        const p1Id = match.player1._id.toString();
        const p2Id = match.player2._id.toString();
        
        if (!standings[p1Id] || !standings[p2Id]) return;

        standings[p1Id].played++;
        standings[p2Id].played++;
        
        standings[p1Id].goalsFor += match.score1;
        standings[p1Id].goalsAgainst += match.score2;
        
        standings[p2Id].goalsFor += match.score2;
        standings[p2Id].goalsAgainst += match.score1;
        
        if (match.score1 > match.score2) {
            standings[p1Id].won++;
            standings[p1Id].points += 3;
            standings[p2Id].lost++;
        } else if (match.score1 < match.score2) {
            standings[p2Id].won++;
            standings[p2Id].points += 3;
            standings[p1Id].lost++;
        } else {
            standings[p1Id].drawn++;
            standings[p1Id].points += 1;
            standings[p2Id].drawn++;
            standings[p2Id].points += 1;
        }
    });
    
    // Finalize GD and Sort
    const sortedStandings = Object.values(standings).map(s => {
        s.goalDifference = s.goalsFor - s.goalsAgainst;
        return s;
    }).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
    });
    
    return sortedStandings;
};

module.exports = { calculateStandings };
