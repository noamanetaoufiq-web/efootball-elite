import React, { useState } from 'react';
import { registerPlayer } from '../api';
import { User, Tag, Shield, Send, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const RegistrationForm = ({ onUserRegistered }) => {
    const [formData, setFormData] = useState({
        name: '',
        efootballId: '',
        teamName: '',
        logoUrl: ''
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await registerPlayer(formData);
            setFormData({ name: '', efootballId: '', teamName: '', logoUrl: '' });
            onUserRegistered();
        } catch (err) {
            alert('Enlistment failed. Check ID format.');
        } finally {
            setSubmitting(false);
        }
    };

    const InputField = ({ icon: Icon, label, name, placeholder, value }) => (
        <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold ml-1">
                {label}
            </label>
            <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-neon-cyan transition-colors">
                    <Icon size={14} />
                </div>
                <input
                    type="text"
                    required={name !== 'logoUrl'}
                    value={value}
                    onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                    className="w-full bg-dark-900/50 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 transition-all font-inter"
                    placeholder={placeholder}
                />
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <InputField 
                icon={User} 
                label="Combatant Name" 
                name="name" 
                placeholder="e.g. SKYLER_ONE" 
                value={formData.name}
            />
            <InputField 
                icon={Tag} 
                label="eFootball ID" 
                name="efootballId" 
                placeholder="123-456-789" 
                value={formData.efootballId}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                    icon={Shield} 
                    label="Squad Name" 
                    name="teamName" 
                    placeholder="RED_DRAKE" 
                    value={formData.teamName}
                />
                <InputField 
                    icon={Shield} 
                    label="Emblem URL" 
                    name="logoUrl" 
                    placeholder="https://..." 
                    value={formData.logoUrl}
                />
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting}
                className="w-full mt-4 flex items-center justify-center gap-3 bg-white text-dark-950 py-3 rounded-xl font-orbitron text-xs font-black uppercase tracking-widest hover:bg-neon-cyan transition-all relative overflow-hidden group"
            >
                {submitting ? (
                    <div className="w-5 h-5 border-2 border-dark-950 border-t-transparent animate-spin rounded-full" />
                ) : (
                    <>
                        DEPLOY TO FIELD
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </motion.button>
            <p className="text-[8px] text-center text-slate-500 uppercase tracking-widest leading-relaxed">By deploying, you agree to the tournament fair-play protocol</p>
        </form>
    );
};

export default RegistrationForm;
