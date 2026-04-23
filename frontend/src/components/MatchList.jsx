import React, { useState } from 'react';
import { updateMatchScore } from '../api';
import { motion } from 'framer-motion';
import { Swords, Check, Edit2, Shield, Lock } from 'lucide-react';

const MatchList = ({ matches, onMatchUpdated, isOwner, showOnlyNext }) => {
    const [editingMatch, setEditingMatch] = useState(null);
    const [scores, setScores] = useState({ home: 0, away: 0 });

    const handleUpdate = async (matchId) => {
        try {
            await updateMatchScore(matchId, scores.home, scores.away);
            setEditingMatch(null);
            onMatchUpdated();
        } catch (err) {
            alert('Failed to update result');
        }
    };

    if (!matches || matches.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center justify-center glass-panel opacity-50">
                <Swords size={48} className="mb-4 text-ef-blue" />
                <p className="font-orbitron text-[10px] tracking-widest uppercase text-slate-400">Combatants not yet deployed</p>
            </div>
        );
    }

    // Filter for sequential match view
    const displayedMatches = showOnlyNext 
        ? [matches.find(m => m.status === 'pending')].filter(Boolean)
        : matches;

    if (showOnlyNext && displayedMatches.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center justify-center glass-panel opacity-50 bg-ef-pitch/5 border-ef-pitch-light">
                <Check size={48} className="mb-4 text-ef-pitch-light" />
                <p className="font-orbitron text-[10px] tracking-widest uppercase text-slate-400">All matches finished</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedMatches.map((match, idx) => (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    key={match._id}
                    className={`glass-card p-5 border-l-4 transition-all ${
                        match.status === 'finished' ? 'border-ef-pitch-light opacity-80' : 'border-ef-gold shadow-ef-gold'
                    }`}
                >
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-[9px] font-orbitron tracking-widest text-ef-gold uppercase font-bold">
                            {match.stageLabel || `Matchday ${idx + 1}`}
                        </span>
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase ${
                            match.status === 'finished' ? 'bg-ef-pitch/20 text-ef-pitch-light' : 'bg-ef-gold/20 text-ef-gold'
                        }`}>
                            {match.status}
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 flex flex-col items-center text-center space-y-2">
                             <div className="w-12 h-12 flex items-center justify-center drop-shadow-md mb-2">
                                 {match.player1?.teamLogo ? <img src={match.player1.teamLogo} alt="" className="w-full h-full object-contain" /> : <Shield className="w-8 h-8 text-slate-600" />}
                             </div>
                             <div className="text-xs font-bold text-white uppercase tracking-tight truncate w-full">{match.player1?.name || 'TBD'}</div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            {editingMatch === match._id ? (
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number" 
                                        className="w-12 h-12 bg-ef-navy border border-ef-gold rounded-lg flex items-center justify-center text-center font-black text-xl text-white focus:outline-none focus:ring-1 focus:ring-ef-gold/50"
                                        value={scores.home}
                                        onChange={(e) => setScores({ ...scores, home: parseInt(e.target.value) || 0 })}
                                    />
                                    <span className="text-slate-600 font-bold">-</span>
                                    <input 
                                        type="number" 
                                        className="w-12 h-12 bg-ef-navy border border-ef-gold rounded-lg flex items-center justify-center text-center font-black text-xl text-white focus:outline-none focus:ring-1 focus:ring-ef-gold/50"
                                        value={scores.away}
                                        onChange={(e) => setScores({ ...scores, away: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 py-2 px-6 bg-ef-navy rounded-full border border-white/5 shadow-inner">
                                    <span className={`text-2xl font-black font-mono tracking-tighter ${match.status === 'finished' ? 'text-white' : 'text-slate-600'}`}>
                                        {match.status === 'finished' ? match.score1 : '-'}
                                    </span>
                                    <div className="w-4 h-px bg-slate-600"></div>
                                    <span className={`text-2xl font-black font-mono tracking-tighter ${match.status === 'finished' ? 'text-white' : 'text-slate-600'}`}>
                                        {match.status === 'finished' ? match.score2 : '-'}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 flex flex-col items-center text-center space-y-2">
                             <div className="w-12 h-12 flex items-center justify-center drop-shadow-md mb-2">
                                 {match.player2?.teamLogo ? <img src={match.player2.teamLogo} alt="" className="w-full h-full object-contain" /> : <Shield className="w-8 h-8 text-slate-600" />}
                             </div>
                             <div className="text-xs font-bold text-white uppercase tracking-tight truncate w-full">{match.player2?.name || 'TBD'}</div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center">
                        {editingMatch === match._id ? (
                            <div className="flex gap-2 w-full">
                                <button 
                                    onClick={() => handleUpdate(match._id)}
                                    className="flex-1 bg-gradient-to-r from-ef-gold to-ef-gold-light text-ef-dark py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                >
                                    <Check size={14} /> SAVE RESULT
                                </button>
                                <button 
                                    onClick={() => setEditingMatch(null)}
                                    className="px-4 bg-ef-navy text-slate-400 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/5 hover:text-white transition-colors"
                                >
                                    CANCEL
                                </button>
                            </div>
                        ) : (
                            isOwner ? (
                                <button 
                                    onClick={() => {
                                        setEditingMatch(match._id);
                                        setScores({ home: match.score1 || 0, away: match.score2 || 0 });
                                    }}
                                    className="flex items-center gap-2 text-[10px] text-slate-400 font-orbitron font-bold tracking-widest uppercase hover:text-ef-gold transition-colors"
                                >
                                    <Edit2 size={12} /> ENTER SCORE
                                </button>
                            ) : (
                                <div className="flex items-center gap-2 text-[9px] text-slate-600 font-orbitron tracking-widest uppercase">
                                    <Lock size={10} /> ONLY HOST CAN EDIT
                                </div>
                            )
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default MatchList;
