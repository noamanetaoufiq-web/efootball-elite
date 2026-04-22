import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Shield } from 'lucide-react';

const Leaderboard = ({ standings }) => {
    if (!standings || standings.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center justify-center glass-panel opacity-50">
                <Trophy size={48} className="mb-4 text-ef-gold" />
                <p className="font-orbitron text-[10px] tracking-widest uppercase text-slate-400">No data points captured</p>
            </div>
        );
    }

    return (
        <div className="glass-panel overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left bg-ef-dark/50 border-b border-white/5">
                            <th className="py-4 px-4 text-[9px] font-orbitron text-ef-gold font-bold uppercase tracking-widest">Rank</th>
                            <th className="py-4 px-4 text-[9px] font-orbitron text-ef-gold font-bold uppercase tracking-widest">Combatant</th>
                            <th className="py-4 px-4 text-[9px] font-orbitron text-ef-gold font-bold uppercase tracking-widest text-center">GP</th>
                            <th className="py-4 px-4 text-[9px] font-orbitron text-ef-gold font-bold uppercase tracking-widest text-center">W-D-L</th>
                            <th className="py-4 px-4 text-[9px] font-orbitron text-ef-gold font-bold uppercase tracking-widest text-center">GF:GA</th>
                            <th className="py-4 px-4 text-[9px] font-orbitron text-ef-gold font-bold uppercase tracking-widest text-center">GD</th>
                            <th className="py-4 px-4 text-[9px] font-orbitron text-ef-gold font-bold uppercase tracking-widest text-right pr-6">PTS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                        {standings.map((player, index) => (
                            <motion.tr 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={player.userId} 
                                className={`group hover:bg-white/5 transition-colors ${index === 0 ? 'bg-gradient-to-r from-ef-gold/10 to-transparent' : ''} ${index > 0 && index < 3 ? 'bg-gradient-to-r from-ef-blue/10 to-transparent' : ''}`}
                            >
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm font-black font-orbitron ${
                                            index === 0 ? 'text-ef-dark shadow-sm px-2.5 py-0.5 bg-gradient-to-br from-ef-gold to-ef-gold-light rounded' : 
                                            index === 1 ? 'text-slate-300' : 
                                            index === 2 ? 'text-orange-400' : 'text-slate-500'
                                        }`}>
                                            {index + 1}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 flex items-center justify-center drop-shadow-md">
                                            {player.teamLogo ? (
                                                <img src={player.teamLogo} alt="" className="w-full h-full object-contain" />
                                            ) : (
                                                <Shield className="w-6 h-6 text-slate-600" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white group-hover:text-ef-gold transition-colors uppercase">{player.name}</div>
                                            <div className="text-[10px] text-slate-400 font-orbitron tracking-widest">{player.teamName}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-center text-sm font-mono text-slate-300 font-bold">{player.played}</td>
                                <td className="py-4 px-4 text-center">
                                    <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold">
                                        <span className="text-ef-pitch-light">{player.won}</span>
                                        <span className="text-slate-600">-</span>
                                        <span className="text-slate-400">{player.drawn}</span>
                                        <span className="text-slate-600">-</span>
                                        <span className="text-red-400">{player.lost}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-center text-sm font-mono text-slate-400">
                                    {player.goalsFor}<span className="text-slate-600 mx-1">:</span>{player.goalsAgainst}
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <span className={`text-xs font-black font-mono px-2 py-0.5 rounded ${player.goalDifference > 0 ? 'bg-ef-pitch/20 text-ef-pitch-light' : player.goalDifference < 0 ? 'bg-red-500/10 text-red-400' : 'text-slate-500'}`}>
                                        {player.goalDifference > 0 ? `+${player.goalDifference}` : player.goalDifference}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <div className={`text-xl font-black font-orbitron ${index === 0 ? 'text-ef-gold drop-shadow-md' : 'text-white'}`}>
                                        {player.points}
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
