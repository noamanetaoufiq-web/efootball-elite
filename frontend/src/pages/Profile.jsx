import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Tag, ArrowRight, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { registerPlayer } from '../api';
import LogoSelector from '../components/LogoSelector';

const InputField = ({ icon: Icon, label, name, placeholder, value, onChange }) => (
    <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest text-ef-gold font-bold ml-1">
            {label}
        </label>
        <div className="relative group/input">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-ef-gold transition-colors">
                <Icon size={16} />
            </div>
            <input
                type="text"
                required
                value={value}
                onChange={onChange}
                className="w-full bg-ef-navy/80 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-ef-gold focus:ring-1 focus:ring-ef-gold/30 transition-all font-inter shadow-inner"
                placeholder={placeholder}
            />
        </div>
    </div>
);

const Profile = () => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        efootballId: '',
        teamName: '',
        teamLogo: ''
    });

    useEffect(() => {
        const savedProfile = localStorage.getItem('efootball_profile');
        if (savedProfile) {
            navigate('/hub');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.teamLogo) {
            alert('Please select a Club Emblem.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await registerPlayer(formData);
            localStorage.setItem('efootball_profile', JSON.stringify(res.data));
            navigate('/hub');
        } catch (err) {
            alert('Registration failed. Try a different ID.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 pitch-pattern opacity-30"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-ef-blue/20 rounded-full blur-[100px] pointer-events-none"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-ef-blue border border-ef-gold shadow-ef-gold mb-6 relative overflow-hidden group">
                        <Shield className="w-8 h-8 text-ef-gold relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-ef-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter shadow-sm">
                        ESPORTS<span className="text-ef-gold">ELITE</span>
                    </h1>
                    <p className="text-xs text-slate-400 font-orbitron tracking-widest mt-2 uppercase">Create your manager profile</p>
                </div>

                <div className="glass-panel p-8 ef-border-gold">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputField 
                            icon={User} 
                            label="Manager Name" 
                            name="name" 
                            placeholder="e.g. SKYLER_ONE" 
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <InputField 
                            icon={Tag} 
                            label="eFootball ID" 
                            name="efootballId" 
                            placeholder="123-456-789" 
                            value={formData.efootballId}
                            onChange={(e) => setFormData({ ...formData, efootballId: e.target.value })}
                        />

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-ef-gold font-bold ml-1">
                                Club Emblem
                            </label>
                            <LogoSelector 
                                selectedLogo={formData.teamLogo} 
                                onSelect={(teamLogo, teamName) => setFormData({ ...formData, teamLogo, teamName })} 
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={submitting}
                            className="w-full mt-4 flex items-center justify-center gap-3 bg-gradient-to-r from-ef-gold to-ef-gold-light text-ef-dark py-4 rounded-xl font-orbitron text-sm font-black uppercase tracking-widest hover:shadow-ef-gold transition-all relative overflow-hidden group"
                        >
                            {submitting ? (
                                <div className="w-5 h-5 border-2 border-ef-dark border-t-transparent animate-spin rounded-full" />
                            ) : (
                                <>
                                    ENTER THE PITCH
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Profile;
