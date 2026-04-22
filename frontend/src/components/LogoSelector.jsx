import React, { useState, useMemo } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import logosData from '../data/logos.json';

const LogoSelector = ({ selectedLogo, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLogos = useMemo(() => {
        return logosData.filter(team => 
            team.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            team.region.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const selectedTeam = logosData.find(t => t.logo === selectedLogo);

    return (
        <div className="relative w-full">
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-ef-navy/80 border border-white/10 rounded-xl py-3 px-4 flex items-center justify-between cursor-pointer hover:border-ef-gold/50 transition-all text-sm"
            >
                {selectedTeam ? (
                    <div className="flex items-center gap-3">
                        <img src={selectedTeam.logo} alt={selectedTeam.name} className="w-6 h-6 object-contain" />
                        <span className="text-white font-bold">{selectedTeam.name}</span>
                    </div>
                ) : (
                    <span className="text-slate-400">Select your Club Emblem...</span>
                )}
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-ef-card border border-ef-gold/30 rounded-xl shadow-2xl shadow-black/50 overflow-hidden backdrop-blur-xl">
                    <div className="p-3 border-b border-white/10 relative">
                        <Search size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search by team or region (e.g. Morocco, Madrid)..."
                            className="w-full bg-ef-dark/50 rounded-lg py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-ef-gold border border-white/5"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="max-h-60 overflow-y-auto p-2 grid grid-cols-1 gap-1">
                        {filteredLogos.length > 0 ? (
                            filteredLogos.map(team => (
                                <div 
                                    key={team.id}
                                    onClick={() => {
                                        onSelect(team.logo, team.name);
                                        setIsOpen(false);
                                        setSearchTerm('');
                                    }}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-ef-blue/40 cursor-pointer transition-colors"
                                >
                                    <img src={team.logo} alt={team.name} className="w-8 h-8 object-contain" />
                                    <div>
                                        <div className="text-white text-sm font-bold">{team.name}</div>
                                        <div className="text-[9px] text-ef-gold uppercase tracking-widest">{team.region}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-slate-500 text-xs">No clubs found matching your search.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LogoSelector;
