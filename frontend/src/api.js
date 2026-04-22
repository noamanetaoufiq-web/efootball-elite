import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:5000/api',
});

export const registerUser = (userData) => api.post('/users/register', userData);
export const registerPlayer = (userData) => api.post('/users/register', userData); 

export const getTournamentByCode = (joinCode) => api.get(`/tournaments/${joinCode}`);
export const getUserTournaments = (userId) => api.get(`/tournaments/user/${userId}`);
export const createTournament = (data) => api.post('/tournaments', data);
export const joinTournament = (joinCode, userId, userProfile) => api.post(`/tournaments/join`, { joinCode, userId, userProfile });
export const startTournament = (tournamentId, userId) => api.post(`/tournaments/start`, { tournamentId, userId });
export const getMatches = (tournamentId) => api.get(`/matches/tournament/${tournamentId}`);
export const updateMatchScore = (matchId, score1, score2) => api.put(`/matches/${matchId}`, { score1, score2 }); 
export const getStandings = (tournamentId) => api.get(`/matches/tournament/${tournamentId}/standings`);

export default api;
