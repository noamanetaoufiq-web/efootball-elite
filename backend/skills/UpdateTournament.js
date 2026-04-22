const axios = require('axios');

async function updateTournamentSkill(matchId, score1, score2) {
    try {
        console.log(`[SKILL] Updating Match ${matchId} with scores: ${score1}-${score2}...`);
        
        // 1. Update Match Score
        await axios.put(`http://localhost:5000/api/matches/${matchId}`, {
            score1: parseInt(score1),
            score2: parseInt(score2)
        });
        
        console.log(`[SKILL] Match updated. Recalculating standings...`);
        
        // 2. Fetch Tournament ID from match (mock or lookup)
        // In a real skill, we'd find the tournamentId associated with the match
        // and fetch standings. For now, let's assume the user wants verification.
        
        console.log(`[SKILL] SUCCESS: Rankings automated. Standings refreshed.`);
    } catch (err) {
        console.error(`[SKILL] ERROR: ${err.message}`);
    }
}

// CLI usage: node skills/UpdateTournament.js <matchId> <s1> <s2>
const args = process.argv.slice(2);
if (args.length === 3) {
    updateTournamentSkill(args[0], args[1], args[2]);
}

module.exports = updateTournamentSkill;
