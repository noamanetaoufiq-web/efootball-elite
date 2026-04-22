import React, { useState, useEffect } from 'react';
import RegistrationForm from '../components/RegistrationForm';
import Leaderboard from '../components/Leaderboard';
import MatchList from '../components/MatchList';
import { getTournaments, getMatches, getStandings, startTournament } from '../api';
import { LayoutDashboard, Play, RefreshCw, Trophy, Users, History, Zap, Shield, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const [tournament, setTournament] = useState(null);
    const [standings, setStandings] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('standings');

    const fetchData = async (tournamentId) => {
        if (!tournamentId) return;
        try {
            const [standingsRes, matchesRes] = await Promise.all([
                getStandings(tournamentId),
                getMatches(tournamentId)
            ]);
            setStandings(standingsRes.data);
            setMatches(matchesRes.data);
        } catch (err) {
            console.error('Error fetching dashboard data', err);
        }
    };

    const updateTournamentInfo = async () => {
        try {
            const res = await getTournaments();
            if (res.data && res.data.length > 0) {
                const active = res.data[0];
                setTournament(active);
                await fetchData(active._id);
            }
        } catch (err) {
            console.error('Update error', err);
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                await updateTournamentInfo();
            } finally {
                setLoading(false);
            }
        };
        init();
        
        const interval = setInterval(updateTournamentInfo, 8000);
        return () => clearInterval(interval);
    }, []);

    const handleStartTournament = async () => {
        if (!tournament) return;
        try {
            await startTournament(tournament._id);
            await updateTournamentInfo();
        } catch (err) {
            alert('Failed to start tournament. Ensure you have enough players.');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-dark-950">
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-neon-cyan font-orbitron tracking-[0.5em] text-sm md:text-lg"
            >
                PROTOCOL_INITIALIZING...
            </motion.div>
        </div>
    );

    return (
        <div className="min-h-screen bg-dark-950 pb-20 selection:bg-neon-cyan selection:text-dark-950">
            <div className="scanline" />
            
            {/* Top Navigation */}
            <nav className="sticky top-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-neon-cyan rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative bg-dark-950 p-2 rounded-lg border border-neon-cyan/20">
                            <Trophy className="w-6 h-6 text-neon-cyan" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-black italic tracking-tighter text-white">
                            ESPORTS<span className="text-neon-cyan">ELITE</span>
                        </h1>
                        <div className="flex items-center gap-2">
                            <span className="h-1 w-1 rounded-full bg-neon-green animate-pulse"></span>
                            <span className="text-[9px] text-slate-500 font-orbitron tracking-widest uppercase">System Online</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {tournament?.status === 'open' && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleStartTournament}
                            className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-neon-cyan text-dark-950 font-bold font-orbitron text-[10px] rounded-lg shadow-[0_0_20px_rgba(0,243,255,0.3)]"
                        >
                            <Zap className="w-3 h-3 fill-dark-950" />
                            START ENGINE
                        </motion.button>
                    )}
                    
                    <button 
                        onClick={updateTournamentInfo}
                        className="p-2.5 bg-dark-800 border border-white/5 rounded-lg text-slate-400 hover:text-white transition-all shadow-xl"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                    
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-neon-magenta to-neon-cyan p-[1px]">
                        <div className="h-full w-full rounded-full bg-dark-900 border-2 border-dark-950 flex items-center justify-center font-bold text-xs">
                            OS
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1400px] mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Side: Competition Control */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Status Card */}
                    <div className="glass-panel p-6 border-t border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Shield size={80} />
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-orbitron text-slate-400 tracking-widest uppercase mb-4">
                            <History className="w-3 h-3 text-neon-yellow" />
                            Tournament Intelligence
                        </div>
                        <div className="space-y-4 relative z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1 uppercase tracking-tight">{tournament?.name}</h2>
                                <div className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold tracking-tighter uppercase ${
                                    tournament?.status === 'active' ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-yellow/20 text-neon-yellow'
                                }`}>
                                    {tournament?.status} protocol alpha
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Combatants</div>
                                    <div className="text-xl font-mono font-bold text-white uppercase">{standings.length}</div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                    <div className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Encounters</div>
                                    <div className="text-xl font-mono font-bold text-white uppercase">{matches.length}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registration Card */}
                    <div className="glass-panel p-6 border-t border-white/10">
                        <div className="flex items-center gap-2 text-[10px] font-orbitron text-slate-400 tracking-widest uppercase mb-6">
                            <Users className="w-3 h-3 text-neon-magenta" />
                            Combatant Sourcing
                        </div>
                        <RegistrationForm onUserRegistered={updateTournamentInfo} />
                    </div>

                    {/* System Metrics */}
                    <div className="glass-panel p-6 border-t border-white/10 bg-gradient-to-br from-neon-cyan/5 to-transparent">
                        <h3 className="text-[10px] font-orbitron text-slate-400 uppercase tracking-widest mb-4">Live Matrix Logs</h3>
                        <div className="space-y-3 font-mono text-[10px]">
                            <div className="flex gap-3 text-slate-500">
                                <span className="text-neon-cyan opacity-70">[SYSTEM]</span>
                                <span>Ranking Engine v4.0.2 Stable</span>
                            </div>
                            <div className="flex gap-3 text-slate-500">
                                <span className="text-neon-magenta opacity-70">[SOCKET]</span>
                                <span>Channel established for updates</span>
                            </div>
                            <div className="flex gap-3 text-slate-300">
                                <span className="text-neon-green opacity-70">[DATA]</span>
                                <span className="animate-pulse">Awaiting match results...</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Data Visualization */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="glass-panel p-2 flex gap-2 mb-4 bg-dark-900/50 backdrop-blur-md sticky top-24 z-30">
                        <button 
                            onClick={() => setActiveTab('standings')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-orbitron text-[10px] tracking-widest transition-all ${
                                activeTab === 'standings' ? 'bg-neon-cyan text-dark-900 font-bold' : 'text-slate-500 hover:text-white'
                            }`}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            LEAGUE_MATRIX
                        </button>
                        <button 
                            onClick={() => setActiveTab('matches')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-orbitron text-[10px] tracking-widest transition-all ${
                                activeTab === 'matches' ? 'bg-neon-magenta text-white font-bold' : 'text-slate-500 hover:text-white'
                            }`}
                        >
                            <Shield className="w-4 h-4" />
                            CONFRONTATIONS
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            {activeTab === 'standings' ? (
                                <Leaderboard standings={standings} />
                            ) : (
                                <MatchList 
                                    matches={matches} 
                                    onMatchUpdated={() => fetchData(tournament?._id)} 
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
