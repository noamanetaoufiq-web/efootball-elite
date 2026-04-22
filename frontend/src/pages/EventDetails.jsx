import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTournamentByCode, getMatches, getStandings } from '../api';
import Leaderboard from '../components/Leaderboard';
import MatchList from '../components/MatchList';
import { Users, Copy, Check, ArrowLeft, Trophy, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const EventDetails = () => {
    const { joinCode } = useParams();
    const navigate = useNavigate();
    const [tournament, setTournament] = useState(null);
    const [standings, setStandings] = useState([]);
    const [matches, setMatches] = useState([]);
    const [profile, setProfile] = useState(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('standings');

    const fetchData = async () => {
        try {
            const tRes = await getTournamentByCode(joinCode);
            const t = tRes.data;
            setTournament(t);

            if (t.status === 'active' || t.status === 'finished') {
                const [standingsRes, matchesRes] = await Promise.all([
                    getStandings(t._id),
                    getMatches(t._id)
                ]);
                setStandings(standingsRes.data);
                setMatches(matchesRes.data);
            }
        } catch (err) {
            console.error('Error fetching event', err);
            // If tournament doesn't exist, go to hub
            if (err.response?.status === 404) navigate('/hub');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const saved = localStorage.getItem('efootball_profile');
        if (!saved) {
            navigate('/');
        } else {
            setProfile(JSON.parse(saved));
        }

        fetchData();
        const interval = setInterval(fetchData, 5000); // Poll for updates (e.g. someone joining or scores updated)
        return () => clearInterval(interval);
    }, [joinCode, navigate]);

    const copyCode = () => {
        navigator.clipboard.writeText(joinCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading || !profile) return (
        <div className="min-h-screen flex items-center justify-center bg-ef-dark">
            <div className="w-8 h-8 border-4 border-ef-gold border-t-transparent animate-spin rounded-full"></div>
        </div>
    );

    const isOwner = tournament?.owner === profile._id;

    return (
        <div className="min-h-screen bg-ef-dark pb-20 selection:bg-ef-gold/30">
            <div className="absolute inset-0 pitch-pattern opacity-10 pointer-events-none"></div>

            {/* Top Navigation */}
            <nav className="sticky top-0 z-50 bg-ef-dark/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/hub')} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <ArrowLeft size={20} className="text-white" />
                    </button>
                    <div>
                        <h1 className="text-lg font-black text-white uppercase tracking-tight">{tournament?.name}</h1>
                        <div className="flex items-center gap-2">
                            <span className={`h-1.5 w-1.5 rounded-full ${tournament?.status === 'open' ? 'bg-ef-gold animate-pulse' : 'bg-ef-pitch-light'}`}></span>
                            <span className="text-[9px] text-slate-400 font-orbitron tracking-widest uppercase">
                                {tournament?.status === 'open' ? 'Waiting for players' : 'Tournament Live'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 bg-ef-card border border-ef-gold/30 rounded-xl py-2 px-4 shadow-ef-gold relative overflow-hidden group cursor-pointer" onClick={copyCode}>
                    <div className="absolute inset-0 bg-ef-gold/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="text-[10px] text-ef-gold font-bold uppercase tracking-widest mr-2">ROOM CODE</div>
                    <div className="text-xl font-orbitron font-black tracking-widest text-white">{joinCode}</div>
                    {copied ? <Check size={16} className="text-green-400 ml-2" /> : <Copy size={16} className="text-slate-400 ml-2 group-hover:text-white transition-colors" />}
                </div>
            </nav>

            <main className="max-w-[1200px] mx-auto px-6 mt-8">
                {tournament?.status === 'open' ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-10 text-center max-w-2xl mx-auto mt-20">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-ef-blue/20 text-ef-light-blue mb-6">
                            <Users size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2">WAITING ROOM</h2>
                        <p className="text-slate-400 mb-8">
                            Waiting for more combatants to join. The tournament will automatically start and generate matches when the room is full.
                        </p>
                        
                        <div className="inline-flex items-center gap-4 px-6 py-3 bg-ef-navy/50 rounded-full border border-white/10 font-mono text-xl text-white mb-8">
                            <span>{tournament.participants.length}</span>
                            <span className="text-slate-600">/</span>
                            <span className="text-ef-gold">{tournament.maxPlayers}</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                            {Array.from({ length: tournament.maxPlayers }).map((_, i) => {
                                const participant = tournament.participants[i];
                                return (
                                    <div key={i} className={`p-4 rounded-xl border ${participant ? 'border-ef-gold bg-ef-gold/5' : 'border-white/5 bg-black/20 border-dashed'} flex flex-col items-center justify-center gap-2 aspect-square`}>
                                        {participant ? (
                                            <>
                                                <img src={participant.teamLogo} alt="" className="w-10 h-10 object-contain drop-shadow-md" />
                                                <span className="text-xs font-bold text-white truncate w-full text-center">{participant.name}</span>
                                            </>
                                        ) : (
                                            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">SLOT OPEN</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                ) : (
                    <div className="space-y-8">
                        <div className="glass-panel p-2 flex gap-2 mb-4 bg-ef-dark/50 backdrop-blur-md sticky top-20 z-40 max-w-sm mx-auto">
                            <button 
                                onClick={() => setActiveTab('standings')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-orbitron text-[10px] tracking-widest transition-all ${
                                    activeTab === 'standings' ? 'bg-gradient-to-r from-ef-gold to-ef-gold-light text-ef-dark font-black' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <Trophy size={14} /> LEAGUE
                            </button>
                            <button 
                                onClick={() => setActiveTab('matches')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-orbitron text-[10px] tracking-widest transition-all ${
                                    activeTab === 'matches' ? 'bg-ef-blue text-white font-black' : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <Activity size={14} /> MATCHES
                            </button>
                        </div>

                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'standings' ? (
                                <Leaderboard standings={standings} />
                            ) : (
                                <MatchList 
                                    matches={matches} 
                                    onMatchUpdated={fetchData} 
                                    isOwner={isOwner}
                                />
                            )}
                        </motion.div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default EventDetails;
