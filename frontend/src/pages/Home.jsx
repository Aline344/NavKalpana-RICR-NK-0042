import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Brain, Rocket, TrendingUp, FileText, Code2, GraduationCap,
    ArrowRight, CheckCircle, Star, Users, Trophy, Lightbulb,
    Sparkles, Zap, BarChart3, ChevronRight, Target, Shield,
    Cpu, BookOpen, FlaskConical, Award
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } };
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.8 } } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const Home = () => {
    const features = [
        {
            icon: <Brain size={22} />,
            title: 'Resume Intelligence',
            desc: 'AI-powered resume analysis with strength scoring, skill gap detection, and improvement recommendations.',
            color: 'from-violet-500 to-indigo-600',
            glow: 'hover:shadow-violet-500/20',
            border: 'hover:border-violet-500/40',
            badge: 'AI Analysis'
        },
        {
            icon: <Zap size={22} />,
            title: 'Adaptive Quizzes',
            desc: 'Dynamic quiz generation that adapts to your weak areas, mistake patterns, and difficulty progression.',
            color: 'from-fuchsia-500 to-pink-600',
            glow: 'hover:shadow-fuchsia-500/20',
            border: 'hover:border-fuchsia-500/40',
            badge: 'Personalized'
        },
        {
            icon: <Code2 size={22} />,
            title: 'AI Assignments',
            desc: 'Personalized coding tasks, mini-projects, and case studies with automated AI evaluation.',
            color: 'from-cyan-500 to-blue-600',
            glow: 'hover:shadow-cyan-500/20',
            border: 'hover:border-cyan-500/40',
            badge: 'Auto-Graded'
        },
        {
            icon: <TrendingUp size={22} />,
            title: 'Mastery Tracking',
            desc: 'Real-time topic mastery heatmap, performance trends, and adaptive difficulty scaling.',
            color: 'from-emerald-500 to-teal-600',
            glow: 'hover:shadow-emerald-500/20',
            border: 'hover:border-emerald-500/40',
            badge: 'Real-time'
        },
        {
            icon: <BookOpen size={22} />,
            title: 'Smart Study Plans',
            desc: 'AI-generated daily study plans based on your risk topics, deadlines, and learning patterns.',
            color: 'from-amber-500 to-orange-600',
            glow: 'hover:shadow-amber-500/20',
            border: 'hover:border-amber-500/40',
            badge: 'Adaptive'
        },
        {
            icon: <Rocket size={22} />,
            title: 'Career Readiness',
            desc: 'Comprehensive readiness scoring combining quiz, assignment, resume, and consistency metrics.',
            color: 'from-rose-500 to-red-600',
            glow: 'hover:shadow-rose-500/20',
            border: 'hover:border-rose-500/40',
            badge: 'Score Based'
        },
    ];

    const stats = [
        { value: '10K+', label: 'Students Prepared', icon: <Users size={24} />, color: 'text-violet-400' },
        { value: '50K+', label: 'Quizzes Generated', icon: <Zap size={24} />, color: 'text-fuchsia-400' },
        { value: '95%', label: 'Placement Rate', icon: <Trophy size={24} />, color: 'text-amber-400' },
        { value: '200+', label: 'Topics Covered', icon: <BookOpen size={24} />, color: 'text-cyan-400' },
    ];

    const steps = [
        { num: '01', title: 'Upload Resume', desc: 'Get instant AI analysis and strength score', icon: <FileText size={20} />, color: 'from-violet-500 to-indigo-500' },
        { num: '02', title: 'Adaptive Learning', desc: 'AI generates personalized quizzes & assignments', icon: <Cpu size={20} />, color: 'from-fuchsia-500 to-pink-500' },
        { num: '03', title: 'Track Mastery', desc: 'Real-time mastery updates and study plan adjustments', icon: <BarChart3 size={20} />, color: 'from-cyan-500 to-blue-500' },
        { num: '04', title: 'Get Placed', desc: 'Achieve career readiness with quantifiable metrics', icon: <Award size={20} />, color: 'from-emerald-500 to-teal-500' },
    ];

    const techStack = ['React + Vite', 'Node.js + Express', 'MongoDB', 'Google Gemini AI', 'JWT Auth', 'Framer Motion'];

    return (
        <div className="overflow-hidden">

            {/* ═══════════════════════ HERO ═══════════════════════ */}
            <section className="relative min-h-screen flex items-center justify-center pt-32 sm:pt-40">
                {/* Deep background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.18),rgba(255,255,255,0))]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_60%,rgba(217,70,239,0.10),transparent)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_20%_80%,rgba(6,182,212,0.08),transparent)]" />

                {/* Animated blobs */}
                <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-[120px] opacity-15" />
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.18, 0.1] }} transition={{ duration: 10, repeat: Infinity, delay: 3 }}
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500 rounded-full blur-[100px] opacity-10" />

                {/* Dot grid */}
                <div className="absolute inset-0 dot-grid opacity-40" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial="hidden" animate="visible" variants={stagger}>

                        {/* Badge */}
                        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-8 border border-primary-500/20">
                            <Sparkles size={13} className="text-primary-400" />
                            <span className="text-xs sm:text-sm font-medium text-gray-300 tracking-wide">AI-Powered Career Intelligence Platform</span>
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black leading-[0.9] tracking-tight mb-6">
                            <span className="text-white block">Master Skills.</span>
                            <span className="block mt-2" style={{
                                background: 'linear-gradient(135deg, #818cf8 0%, #d946ef 40%, #06b6d4 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                Ace Every Interview.
                            </span>
                        </motion.h1>

                        {/* Sub */}
                        <motion.p variants={fadeUp} className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            From learning to placement — ACIE adapts to your weaknesses, generates personalized preparation,
                            and <span className="text-white font-medium">quantifies your career readiness</span> with AI.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                            <Link to="/signup"
                                className="group flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl transition-all duration-300"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #d946ef)', boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}>
                                Get Started Free
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                            <Link to="/about"
                                className="flex items-center gap-2 px-8 py-4 text-base font-medium text-gray-300 glass rounded-2xl border border-white/[0.15] hover:bg-white/10 hover:text-white transition-all duration-300">
                                Learn More
                                <ChevronRight size={16} className="opacity-60" />
                            </Link>
                        </motion.div>

                        {/* Hero Dashboard Preview */}
                        <motion.div variants={fadeUp} className="relative max-w-4xl mx-auto">
                            {/* Outer glow ring */}
                            <div className="absolute -inset-px rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.4) 0%, rgba(217,70,239,0.3) 50%, rgba(6,182,212,0.2) 100%)' }} />
                            <div className="relative bg-dark-950/90 backdrop-blur-2xl rounded-3xl border border-white/10 p-5 sm:p-8">
                                {/* Window bar */}
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                                    <div className="ml-3 flex-1 h-6 bg-white/5 rounded-lg text-xs text-gray-500 flex items-center px-3">acie.ai/dashboard</div>
                                </div>

                                {/* Stats row */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                    {[
                                        { label: 'Mastery Score', val: '78%', icon: <Brain size={14} />, c: 'text-violet-400', bg: 'bg-violet-500/10' },
                                        { label: 'Resume Strength', val: '85/100', icon: <FileText size={14} />, c: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                                        { label: 'Quizzes Done', val: '24', icon: <Zap size={14} />, c: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10' },
                                        { label: 'Career Ready', val: '73%', icon: <Rocket size={14} />, c: 'text-amber-400', bg: 'bg-amber-500/10' },
                                    ].map((s, i) => (
                                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.1 }}
                                            className={`${s.bg} border border-white/5 rounded-xl p-3 text-center`}>
                                            <div className={`${s.c} flex items-center justify-center gap-1 text-xs mb-1`}>{s.icon}</div>
                                            <p className={`text-lg sm:text-2xl font-bold ${s.c}`}>{s.val}</p>
                                            <p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Progress bars */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {[
                                        { topic: 'JavaScript', pct: 82, color: 'from-violet-500 to-indigo-500' },
                                        { topic: 'React', pct: 65, color: 'from-fuchsia-500 to-pink-500' },
                                        { topic: 'Node.js', pct: 71, color: 'from-cyan-500 to-blue-500' },
                                    ].map((t, i) => (
                                        <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-xs text-gray-300 font-medium">{t.topic}</span>
                                                <span className="text-xs text-gray-500">{t.pct}%</span>
                                            </div>
                                            <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                                                <motion.div initial={{ width: 0 }} animate={{ width: `${t.pct}%` }} transition={{ delay: 1.2 + i * 0.2, duration: 0.8 }}
                                                    className={`h-full rounded-full bg-gradient-to-r ${t.color}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600 flex flex-col items-center gap-1">
                    <div className="w-5 h-8 border border-white/15 rounded-full flex items-start justify-center pt-1.5">
                        <div className="w-1 h-2 bg-primary-400 rounded-full" />
                    </div>
                </motion.div>
            </section>

            {/* ═══════════════════════ STATS ═══════════════════════ */}
            <section className="py-16 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                        className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {stats.map((s, i) => (
                            <motion.div key={i} variants={fadeUp}
                                className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 group">
                                <div className={`${s.color} flex justify-center mb-3 group-hover:scale-110 transition-transform`}>{s.icon}</div>
                                <p className="text-3xl sm:text-4xl font-display font-black" style={{
                                    background: 'linear-gradient(135deg, #818cf8, #d946ef)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}>{s.value}</p>
                                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════ FEATURES ═══════════════════════ */}
            <section className="py-24 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[80px]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
                        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-4 border border-accent-500/20">
                            <Sparkles size={13} className="text-accent-400" />
                            <span className="text-xs font-medium text-gray-300 tracking-widest uppercase">Powerful Features</span>
                        </motion.div>
                        <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-display font-black mb-4">
                            <span style={{ background: 'linear-gradient(135deg, #818cf8, #d946ef, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Everything You Need</span>
                            <br />
                            <span className="text-white">To Succeed</span>
                        </motion.h2>
                        <motion.p variants={fadeUp} className="text-gray-400 text-lg max-w-xl mx-auto">
                            A complete AI-driven ecosystem that adapts to your learning needs
                        </motion.p>
                    </motion.div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((f, i) => (
                            <motion.div key={i} variants={fadeUp}
                                className={`group relative bg-white/[0.03] border border-white/8 rounded-2xl p-6 cursor-pointer
                                    transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06] ${f.border} ${f.glow} hover:shadow-xl`}>
                                {/* Badge */}
                                <div className="absolute top-4 right-4">
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500">{f.badge}</span>
                                </div>
                                {/* Icon */}
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-4
                                    group-hover:scale-110 transition-transform duration-300`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                                <div className="mt-4 flex items-center gap-1 text-xs text-gray-600 group-hover:text-primary-400 transition-colors">
                                    <span>Explore</span>
                                    <ChevronRight size={12} />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════ HOW IT WORKS ═══════════════════════ */}
            <section className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-900/5 to-transparent" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
                        <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-display font-black mb-4">
                            <span className="text-white">How </span>
                            <span style={{ background: 'linear-gradient(135deg, #818cf8, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ACIE Works</span>
                        </motion.h2>
                        <motion.p variants={fadeUp} className="text-gray-400 text-lg">Four simple steps to career readiness</motion.p>
                    </motion.div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((s, i) => (
                            <motion.div key={i} variants={fadeUp} className="relative">
                                {/* Connector line */}
                                {i < 3 && (
                                    <div className="hidden lg:block absolute top-8 left-full w-full h-px z-10" style={{
                                        background: 'linear-gradient(90deg, rgba(99,102,241,0.4), transparent)'
                                    }} />
                                )}
                                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center relative overflow-hidden group hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300">
                                    {/* Big number watermark */}
                                    <div className="absolute -top-2 -right-2 text-7xl font-black text-white/[0.02] select-none">{s.num}</div>
                                    {/* Icon circle */}
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-4 text-white
                                        group-hover:scale-110 transition-transform duration-300`}>
                                        {s.icon}
                                    </div>
                                    <div className="text-xs text-gray-600 mb-1 font-mono">STEP {s.num}</div>
                                    <h3 className="text-white font-bold mb-2">{s.title}</h3>
                                    <p className="text-gray-400 text-sm">{s.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════ MASTERY FORMULA ═══════════════════════ */}
            <section className="py-20 relative">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                        <motion.div variants={fadeUp} className="text-center mb-10">
                            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
                                The <span style={{ background: 'linear-gradient(135deg, #818cf8, #d946ef)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Mastery Formula</span>
                            </h2>
                            <p className="text-gray-400">Our scientifically designed scoring algorithm</p>
                        </motion.div>

                        <motion.div variants={fadeUp} className="relative rounded-3xl overflow-hidden border border-white/10"
                            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(217,70,239,0.05), rgba(6,182,212,0.05))' }}>
                            <div className="p-6 sm:p-10">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
                                    {[
                                        { label: 'Quiz Score', pct: '50%', icon: <Zap size={20} />, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
                                        { label: 'Assignment Score', pct: '30%', icon: <Code2 size={20} />, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
                                        { label: 'Consistency', pct: '20%', icon: <CheckCircle size={20} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                                    ].map((item, i) => (
                                        <div key={i} className={`${item.bg} border rounded-2xl p-5`}>
                                            <div className={`${item.color} flex justify-center mb-2`}>{item.icon}</div>
                                            <div className="text-3xl font-black text-white mb-1">{item.pct}</div>
                                            <div className="text-sm text-gray-400">{item.label}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center mt-6 text-sm text-gray-500 font-mono">
                                    Mastery = (Quiz × 0.50) + (Assignment × 0.30) + (Consistency × 0.20)
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════ TECH STACK STRIP ═══════════════════════ */}
            <section className="py-10 border-y border-white/5 relative overflow-hidden">
                <div className="flex items-center gap-3 text-center text-gray-600 text-xs mb-4 justify-center uppercase tracking-widest">
                    <Shield size={11} /> Built with modern stack
                </div>
                <div className="flex flex-wrap justify-center gap-3 px-4">
                    {techStack.map((t, i) => (
                        <span key={i} className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/8 text-xs text-gray-400 hover:text-white hover:border-white/20 transition-all cursor-default">
                            {t}
                        </span>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════ CTA ═══════════════════════ */}
            <section className="py-28 relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(99,102,241,0.12),transparent)]" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6 border border-primary-500/20">
                            <Target size={13} className="text-primary-400" />
                            <span className="text-xs text-gray-300">Start for free — no credit card required</span>
                        </motion.div>
                        <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-display font-black mb-6">
                            <span className="text-white">Ready to </span>
                            <span style={{ background: 'linear-gradient(135deg, #818cf8, #d946ef)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Level Up?</span>
                        </motion.h2>
                        <motion.p variants={fadeUp} className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                            Join thousands of students using AI to accelerate their career preparation and land their dream job.
                        </motion.p>
                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/signup"
                                className="group flex items-center gap-2 px-10 py-4 text-lg font-semibold text-white rounded-2xl transition-all duration-300"
                                style={{ background: 'linear-gradient(135deg, #6366f1, #d946ef)', boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
                                Start Your Journey
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/about" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                                <FlaskConical size={15} />
                                See how it works
                            </Link>
                        </motion.div>

                        {/* Trust badges */}
                        <motion.div variants={fadeUp} className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-600">
                            {[
                                { icon: <Shield size={12} />, text: 'No Credit Card' },
                                { icon: <Zap size={12} />, text: 'Instant Access' },
                                { icon: <Star size={12} />, text: 'Free Forever Plan' },
                                { icon: <CheckCircle size={12} />, text: 'AI-Powered' },
                            ].map((b, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <span className="text-primary-400">{b.icon}</span>
                                    {b.text}
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
