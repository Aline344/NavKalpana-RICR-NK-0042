import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Eye, EyeOff, User, Mail, Lock, Briefcase, ArrowLeft, Sparkles, ShieldCheck, ChevronRight, Zap } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) return setError('Password must be at least 6 characters');
        if (password !== confirmPass) return setError('Passwords do not match');
        setLoading(true);
        try {
            const res = await register(name, email, password);
            if (res.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full w-full flex items-center justify-center relative overflow-hidden bg-dark-950 px-4 py-4 sm:py-8">
            {/* ══════════════ DYNAMIC BACKGROUND ══════════════ */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_0%,rgba(168,85,247,0.15),transparent_50%)]" />
                <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_100%,rgba(99,102,241,0.1),transparent_40%)]" />

                {/* Animated Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                        x: [0, -50, 0],
                        y: [0, 60, 0]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-accent-600/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        x: [0, 40, 0],
                        y: [0, -40, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px]"
                />

                {/* Visual Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
            </div>

            {/* ══════════════ BACK TO HOME ══════════════ */}
            <Link to="/" className="absolute top-8 left-8 z-20 flex items-center gap-2 text-gray-500 hover:text-white transition-all group">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 group-hover:border-primary-500/50 group-hover:bg-primary-500/10">
                    <ArrowLeft size={14} />
                </div>
                <span className="text-sm font-medium">Exit Journey</span>
            </Link>

            {/* ══════════════ SIGNUP CARD ══════════════ */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-[440px]"
            >
                <div className="glass-strong p-4 sm:p-6 rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-3xl">
                    {/* Brand */}
                    <div className="flex flex-col items-center mb-6">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: -5 }}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-primary-600 flex items-center justify-center shadow-xl shadow-accent-500/20 mb-3"
                        >
                            <Brain size={20} className="text-white" />
                        </motion.div>
                        <h1 className="text-2xl font-display font-bold text-white mb-1 tracking-tight text-center">
                            Join the <span className="gradient-text">Future.</span>
                        </h1>
                        <p className="text-gray-400 text-center text-[11px]">Your AI-powered career journey starts here</p>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-3 bg-red-500/10 border border-red-500/20 rounded-xl p-2 flex items-center gap-3 overflow-hidden"
                            >
                                <div className="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                    <ShieldCheck size={12} className="text-red-400" />
                                </div>
                                <p className="text-xs text-red-400 font-medium">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-primary-500/50 transition-all font-medium"
                                        placeholder="Alex Johnson"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email</label>
                                <div className="relative group">
                                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-primary-500/50 transition-all font-medium"
                                        placeholder="alex@acie.ai"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative group">
                                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-primary-500/50 transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm</label>
                                <div className="relative group">
                                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        value={confirmPass}
                                        onChange={e => setConfirmPass(e.target.value)}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-10 text-xs text-white focus:outline-none focus:border-primary-500/50 transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 py-2 ml-1">
                            <div className="pt-0.5">
                                <input type="checkbox" id="terms" required className="w-4 h-4 rounded border-white/10 bg-dark-800 text-primary-500 focus:ring-primary-500/20" />
                            </div>
                            <label htmlFor="terms" className="text-[10px] text-gray-500 leading-tight">
                                I agree to the <span className="text-gray-300 underline">Terms of Service</span> and understand my data is protected by <span className="text-gray-300 underline">Privacy Policy</span>.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group h-[44px] overflow-hidden rounded-xl bg-gradient-to-r from-accent-600 to-primary-600 shadow-xl shadow-accent-500/20 hover:shadow-accent-500/40 transition-all active:scale-[0.98] mt-1"
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative z-10 flex items-center justify-center gap-2 text-white font-bold text-sm">
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                ) : (
                                    <>Begin Journey <ChevronRight size={18} /></>
                                )}
                            </span>
                        </button>
                    </form>

                    {/* Foot Link */}
                    <div className="mt-4 pt-4 border-t border-white/5 text-center">
                        <p className="text-sm text-gray-400">
                            Already part of the network?{' '}
                            <Link to="/login" className="text-white hover:text-accent-400 font-bold transition-all ml-1">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Bottom Stats */}
                <div className="mt-4 grid grid-cols-3 gap-4 px-6">
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-display font-bold text-white tracking-tight">100%</span>
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">AI Guided</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-display font-bold text-white tracking-tight">Secure</span>
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">End-to-End</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-lg font-display font-bold text-white tracking-tight">Instant</span>
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Feedback</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
