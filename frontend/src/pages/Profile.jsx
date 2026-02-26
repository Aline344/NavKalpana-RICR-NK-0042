import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Briefcase, Zap, ShieldCheck, Save, Plus, X, Brain, Sparkles, TrendingUp, Settings } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
    const { user, token } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [targetRole, setTargetRole] = useState(user?.targetRole || '');
    const [email] = useState(user?.email || '');
    const [newSkill, setNewSkill] = useState('');
    const [skills, setSkills] = useState(user?.skills || []);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setName(user.name);
            setTargetRole(user.targetRole || '');
            setSkills(user.skills || []);
        }
    }, [user]);

    const handleAddSkill = (e) => {
        e.preventDefault();
        if (newSkill && !skills.includes(newSkill)) {
            setSkills([...skills, newSkill]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setSkills(skills.filter(skill => skill !== skillToRemove));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const { data } = await axios.put('/api/auth/profile', {
                name,
                targetRole,
                skills
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden bg-dark-950">
            {/* Background elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-accent-600/5 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-primary-400">
                            <Settings size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Account <span className="gradient-text">Settings</span></h1>
                            <p className="text-gray-500 text-sm mt-1 font-medium tracking-wide">Manage your professional identity and preferences</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="glass-strong p-8 rounded-[32px] border border-white/10 flex flex-col items-center">
                                <div className="relative group mb-6">
                                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 flex items-center justify-center text-4xl font-bold text-white shadow-2xl shadow-primary-500/20 group-hover:scale-105 transition-transform duration-500 uppercase">
                                        {user?.name?.charAt(0)}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-dark-900 border border-white/10 flex items-center justify-center text-primary-400 shadow-xl">
                                        <Sparkles size={14} />
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                                <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mt-1">{user?.role}</p>

                                <div className="w-full h-px bg-white/5 my-6" />

                                <div className="w-full space-y-4">
                                    <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors cursor-pointer group">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary-500/10 transition-all border border-transparent group-hover:border-primary-500/20">
                                            <User size={14} />
                                        </div>
                                        <span className="text-sm font-medium">Personal Info</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors cursor-pointer group opacity-50 grayscale cursor-not-allowed">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                            <ShieldCheck size={14} />
                                        </div>
                                        <span className="text-sm font-medium">Privacy</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            <form onSubmit={handleUpdateProfile} className="glass-strong p-8 sm:p-10 rounded-[32px] border border-white/10 relative overflow-hidden">
                                <AnimatePresence>
                                    {message.text && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                            className={`${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'} border rounded-2xl p-4 flex items-center gap-3`}
                                        >
                                            <Zap size={16} />
                                            <p className="text-sm font-medium">{message.text}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <div className="relative group">
                                                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={e => setName(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary-500/50 transition-all font-medium"
                                                    placeholder="Alex Johnson"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                            <div className="relative group opacity-60">
                                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                                <input
                                                    type="email"
                                                    value={email}
                                                    readOnly
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white cursor-not-allowed font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Target Professional Role</label>
                                        <div className="relative group">
                                            <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                                            <input
                                                type="text"
                                                value={targetRole}
                                                onChange={e => setTargetRole(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary-500/50 transition-all font-medium"
                                                placeholder="e.g. Senior Software Engineer"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Skill Inventory</label>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{skills.length} Loaded</span>
                                        </div>

                                        <div className="flex flex-wrap gap-2 min-h-[40px]">
                                            {skills.map(skill => (
                                                <motion.div
                                                    layout
                                                    key={skill}
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="px-3 py-1.5 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold flex items-center gap-2 group"
                                                >
                                                    {skill}
                                                    <button type="button" onClick={() => removeSkill(skill)} className="hover:text-white transition-colors">
                                                        <X size={12} />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </div>

                                        <div className="flex gap-2">
                                            <div className="relative group flex-1">
                                                <TrendingUp size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-400 transition-colors" />
                                                <input
                                                    type="text"
                                                    value={newSkill}
                                                    onChange={e => setNewSkill(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && handleAddSkill(e)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-accent-500/50 transition-all"
                                                    placeholder="Add a new skill..."
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleAddSkill}
                                                className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:bg-primary-500/20 hover:text-primary-400 hover:border-primary-500/30 transition-all active:scale-[0.95]"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full relative group h-[56px] overflow-hidden rounded-2xl bg-gradient-to-r from-primary-600 to-accent-600 shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 transition-all active:scale-[0.98] mt-6"
                                    >
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="relative z-10 flex items-center justify-center gap-2 text-white font-bold tracking-wide">
                                            {loading ? (
                                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                            ) : (
                                                <><Save size={18} /> Update Profile</>
                                            )}
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
