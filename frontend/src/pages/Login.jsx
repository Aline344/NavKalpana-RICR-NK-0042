import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Eye, EyeOff, Mail, Lock, FileText, Zap, TrendingUp, ArrowLeft, Sparkles, ChevronRight, ShieldCheck, X } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await login(email.trim(), password);
            if (res.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full w-full flex items-center justify-center relative overflow-hidden bg-dark-950 px-4 py-4 sm:py-8">
            {/* ══════════════ DYNAMIC BACKGROUNd ══════════════ */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_50%)]" />
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(168,85,247,0.1),transparent_40%)]" />

                {/* Animated Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        x: [0, 50, 0],
                        y: [0, -30, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                        x: [0, -60, 0],
                        y: [0, 40, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-accent-600/10 rounded-full blur-[120px]"
                />

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
            </div>

            {/* ══════════════ BACK TO HOME ══════════════ */}
            <Link to="/" className="absolute top-8 left-8 z-20 flex items-center gap-2 text-gray-500 hover:text-white transition-all group">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 group-hover:border-primary-500/50 group-hover:bg-primary-500/10">
                    <ArrowLeft size={14} />
                </div>
                <span className="text-sm font-medium">Back to Portal</span>
            </Link>

            {/* ══════════════ LOGIN CARD ══════════════ */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-[380px]"
            >
                <div className="glass-strong p-5 sm:p-8 rounded-[28px] border border-white/10 shadow-2xl relative overflow-hidden">
                    {/* Decorative Shine */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/20 rounded-full blur-[60px]" />

                    {/* Brand */}
                    <div className="flex flex-col items-center mb-6">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 flex items-center justify-center shadow-xl shadow-primary-500/20 mb-4"
                        >
                            <Brain size={24} className="text-white" />
                        </motion.div>
                        <h1 className="text-2xl font-display font-bold text-white mb-1 tracking-tight text-center">
                            Welcome <span className="gradient-text">Back.</span>
                        </h1>
                        <p className="text-gray-400 text-center text-[11px]">Elevate your career preparation with ACIE</p>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 overflow-hidden"
                            >
                                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                    <X size={14} className="text-red-400" />
                                </div>
                                <p className="text-xs text-red-400 font-medium">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Identity</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Security</label>
                                <button type="button" className="text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors">Forgot?</button>
                            </div>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-11 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group h-[48px] overflow-hidden rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 transition-all duration-300 active:scale-[0.98]"
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative z-10 flex items-center justify-center gap-2 text-white font-bold text-sm">
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                ) : (
                                    <>Sign In <ChevronRight size={20} /></>
                                )}
                            </span>
                        </button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-4 pt-4 border-t border-white/5 flex flex-col items-center gap-3">
                        <p className="text-gray-400 text-sm">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-white hover:text-primary-400 font-bold transition-all ml-1">
                                Create an account
                            </Link>
                        </p>
                        <div className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
                            <Sparkles size={16} className="text-primary-400" />
                            <div className="w-1 h-1 rounded-full bg-gray-600" />
                            <ShieldCheck size={16} className="text-accent-400" />
                            <div className="w-1 h-1 rounded-full bg-gray-600" />
                            <Brain size={16} className="text-emerald-400" />
                        </div>
                    </div>
                </div>

                {/* Bottom Badges */}
                <div className="mt-8 flex justify-center gap-8 opacity-40">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                        <Zap size={10} className="text-yellow-500" /> AI Adaptive
                    </div>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                        <TrendingUp size={10} className="text-primary-500" /> Mastery Driven
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
