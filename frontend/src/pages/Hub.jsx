import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Plus, Search, LogOut, ArrowRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { createTournament, joinTournament, getUserTournaments } from '../api';

const Hub = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [joinCode, setJoinCode] = useState('');
    const [creating, setCreating] = useState(false);
    const [joining, setJoining] = useState(false);
    const [myTournaments, setMyTournaments] = useState([]);
    const [loadingTournaments, setLoadingTournaments] = useState(true);
    
    const [newEvent, setNewEvent] = useState({
        name: '',
        maxPlayers: 4,
        isOwnerPlaying: true
    });

    useEffect(() => {
        const saved = localStorage.getItem('efootball_profile');
        if (!saved) {
            navigate('/');
        } else {
            const user = JSON.parse(saved);
            setProfile(user);
            fetchMyTournaments(user._id);
        }
    }, [navigate]);

    const fetchMyTournaments = async (userId) => {
        try {
            const res = await getUserTournaments(userId);
            setMyTournaments(res.data);
        } catch (err) {
            console.error('Failed to fetch tournaments', err);
        } finally {
            setLoadingTournaments(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const res = await createTournament({
                name: newEvent.name,
                maxPlayers: newEvent.maxPlayers,
                ownerId: profile._id,
                ownerProfile: profile,
                isOwnerPlaying: newEvent.isOwnerPlaying
            });
            // Redirect to the new event dashboard
            navigate(`/event/${res.data.joinCode}`);
        } catch (err) {
            alert('Failed to create event.');
        } finally {
            setCreating(false);
        }
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        if (!joinCode) return;
        setJoining(true);
        try {
            const res = await joinTournament(joinCode, profile._id, profile);
            navigate(`/event/${res.data.joinCode}`);
        } catch (err) {
            alert(err.response?.data?.msg || 'Failed to join tournament. Check the code.');
        } finally {
            setJoining(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('efootball_profile');
        navigate('/');
    };

    if (!profile) return null;

    return (
        <div className="min-h-screen bg-ef-dark p-6 relative overflow-hidden font-inter selection:bg-ef-gold/30">
            <div className="absolute inset-0 pitch-pattern opacity-10"></div>
            
            {/* Top Bar */}
            <nav className="relative z-10 max-w-5xl mx-auto flex justify-between items-center bg-ef-card/50 backdrop-blur-md border border-white/5 p-4 rounded-2xl mb-8">
                <div className="flex items-center gap-4">
                    <img src={profile.teamLogo} alt="" className="w-10 h-10 object-contain drop-shadow-md" />
                    <div>
                        <div className="text-white font-black uppercase text-sm tracking-widest">{profile.name}</div>
                        <div className="text-ef-gold text-[10px] font-orbitron tracking-[0.2em]">{profile.teamName}</div>
                    </div>
                </div>
                <button onClick={handleLogout} className="text-slate-400 hover:text-white transition-colors p-2">
                    <LogOut size={18} />
                </button>
            </nav>

            <main className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* CREATE EVENT */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel p-8 ef-border-gold flex flex-col h-full"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-ef-gold/20 rounded-xl text-ef-gold">
                            <Plus size={24} />
                        </div>
                        <h2 className="text-xl font-black text-white">HOST EVENT</h2>
                    </div>
                    
                    <form onSubmit={handleCreate} className="space-y-6 flex-1 flex flex-col">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-ef-gold font-bold ml-1">Event Name</label>
                            <input
                                required
                                value={newEvent.name}
                                onChange={e => setNewEvent({...newEvent, name: e.target.value})}
                                placeholder="e.g. Weekend Cup"
                                className="w-full bg-ef-navy/80 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-ef-gold focus:ring-1 focus:ring-ef-gold/30 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-ef-gold font-bold ml-1">Total Combatants</label>
                            <select
                                value={newEvent.maxPlayers}
                                onChange={e => setNewEvent({...newEvent, maxPlayers: parseInt(e.target.value)})}
                                className="w-full bg-ef-navy/80 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-ef-gold focus:ring-1 focus:ring-ef-gold/30 outline-none appearance-none"
                            >
                                {[2, 3, 4, 5, 6, 8, 10, 16].map(num => (
                                    <option key={num} value={num}>{num} Players</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-white uppercase tracking-wider">Join as Player?</span>
                                <span className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mt-0.5">Participate in matches</span>
                            </div>
                            <button 
                                type="button"
                                onClick={() => setNewEvent({...newEvent, isOwnerPlaying: !newEvent.isOwnerPlaying})}
                                className={`w-10 h-5 rounded-full relative transition-colors duration-200 focus:outline-none ${newEvent.isOwnerPlaying ? 'bg-ef-gold' : 'bg-slate-700'}`}
                            >
                                <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${newEvent.isOwnerPlaying ? 'translate-x-5' : ''}`}></div>
                            </button>
                        </div>
                        <div className="mt-auto pt-6">
                            <button disabled={creating} className="w-full btn-primary flex items-center justify-center gap-2">
                                {creating ? 'GENERATING...' : 'GENERATE EVENT ROOM'}
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* JOIN EVENT */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-panel p-8 ef-border-blue flex flex-col h-full bg-ef-blue/5"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-ef-light-blue/20 rounded-xl text-ef-light-blue">
                            <Search size={24} />
                        </div>
                        <h2 className="text-xl font-black text-white">JOIN EVENT</h2>
                    </div>
                    
                    <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                        Received an invite code? Enter it below to join the tournament room. Once the room is full, matchmaking will automatically begin.
                    </p>

                    <form onSubmit={handleJoin} className="space-y-6 mt-auto">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-ef-light-blue font-bold ml-1">Room Code</label>
                            <input
                                required
                                value={joinCode}
                                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                                placeholder="e.g. X7K9A"
                                maxLength={6}
                                className="w-full bg-ef-navy/80 border border-white/10 rounded-xl py-4 px-4 text-xl tracking-[0.5em] text-center font-orbitron text-white focus:border-ef-light-blue focus:ring-1 focus:ring-ef-light-blue/30 outline-none uppercase"
                            />
                        </div>
                        <button disabled={joining} className="w-full btn-secondary flex items-center justify-center gap-2 mt-4">
                            {joining ? 'AUTHENTICATING...' : 'ENTER ROOM'}
                        </button>
                    </form>
                </motion.div>
            </main>

            {/* MY ACTIVE ROOMS */}
            <section className="relative z-10 max-w-5xl mx-auto mt-12 pb-20">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-ef-blue/20 rounded-lg text-ef-light-blue">
                        <Trophy size={20} />
                    </div>
                    <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">MY ACTIVE ROOMS</h2>
                </div>

                {loadingTournaments ? (
                    <div className="flex gap-4 overflow-x-auto pb-4">
                        {[1, 2].map(i => (
                            <div key={i} className="min-w-[280px] h-32 bg-white/5 animate-pulse rounded-2xl border border-white/5"></div>
                        ))}
                    </div>
                ) : myTournaments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {myTournaments.map((t, idx) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                key={t._id}
                                onClick={() => navigate(`/event/${t.joinCode}`)}
                                className="glass-panel p-5 cursor-pointer group hover:border-ef-blue transition-all relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Trophy size={40} className="text-ef-blue" />
                                </div>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-white font-black uppercase text-sm truncate pr-8">{t.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'open' ? 'bg-ef-gold animate-pulse' : 'bg-ef-pitch-light'}`}></span>
                                            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{t.status}</span>
                                        </div>
                                    </div>
                                    <div className="bg-ef-navy/50 px-2 py-1 rounded text-[10px] font-orbitron text-white border border-white/5">
                                        {t.joinCode}
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between mt-6">
                                    <div className="flex -space-x-2">
                                        {t.participants.slice(0, 3).map((p, i) => (
                                            <img key={i} src={p.teamLogo} className="w-6 h-6 rounded-full border border-ef-dark bg-ef-card object-contain" alt="" />
                                        ))}
                                        {t.participants.length > 3 && (
                                            <div className="w-6 h-6 rounded-full bg-ef-navy border border-ef-dark flex items-center justify-center text-[8px] text-white font-bold">
                                                +{t.participants.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-ef-light-blue group-hover:translate-x-1 transition-transform">
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-panel p-10 text-center border-dashed border-white/10 opacity-50">
                        <Activity size={32} className="mx-auto mb-4 text-slate-600" />
                        <p className="text-[10px] font-orbitron uppercase tracking-widest text-slate-400">No active rooms found</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Hub;
