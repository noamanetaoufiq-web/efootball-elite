const db = require('./mockDb');

const calculateStandings = async (tournamentId) => {
    const matches = db.matches.filter(m => m.tournamentId === tournamentId && m.status === 'completed');
    
    // Unique participants from the tournament
    const tournament = db.tournaments.find(t => t._id === tournamentId);
    if (!tournament) return [];
    
    const uniqueParticipants = tournament.participants.map(p => p._id);
    
    const standings = {};
    
    // Initialize
    for (const userId of uniqueParticipants) {
        const user = db.users.find(u => u._id === userId);
        if (!user) continue;
        standings[userId] = {
            userId,
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
    }
    
    // Process matches
    matches.forEach(match => {
        const p1 = match.player1._id;
        const p2 = match.player2._id;
        
        if (!standings[p1] || !standings[p2]) return;

        standings[p1].played++;
        standings[p2].played++;
        
        standings[p1].goalsFor += match.score1;
        standings[p1].goalsAgainst += match.score2;
        
        standings[p2].goalsFor += match.score2;
        standings[p2].goalsAgainst += match.score1;
        
        if (match.score1 > match.score2) {
            standings[p1].won++;
            standings[p1].points += 3;
            standings[p2].lost++;
        } else if (match.score1 < match.score2) {
            standings[p2].won++;
            standings[p2].points += 3;
            standings[p1].lost++;
        } else {
            standings[p1].drawn++;
            standings[p1].points += 1;
            standings[p2].drawn++;
            standings[p2].points += 1;
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
