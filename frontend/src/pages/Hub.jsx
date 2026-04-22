import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Plus, Search, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { createTournament, joinTournament } from '../api';

const Hub = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [joinCode, setJoinCode] = useState('');
    const [creating, setCreating] = useState(false);
    const [joining, setJoining] = useState(false);
    
    const [newEvent, setNewEvent] = useState({
        name: '',
        maxPlayers: 4
    });

    useEffect(() => {
        const saved = localStorage.getItem('efootball_profile');
        if (!saved) {
            navigate('/');
        } else {
            setProfile(JSON.parse(saved));
        }
    }, [navigate]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const res = await createTournament({
                name: newEvent.name,
                maxPlayers: newEvent.maxPlayers,
                ownerId: profile._id
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
            const res = await joinTournament(joinCode, profile._id);
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
        </div>
    );
};

export default Hub;
