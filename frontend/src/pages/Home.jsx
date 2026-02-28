import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, GlassCard } from '../components/ui/Card';
import {
    Brain, Rocket, TrendingUp, FileText, Code2, GraduationCap,
    ArrowRight, CheckCircle, Star, Users, Trophy, Lightbulb,
    Sparkles, Zap, BarChart3, ChevronRight, Target, Shield,
    Cpu, BookOpen, FlaskConical, Award, Plus, Minus, Quote
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const Home = () => {
    const features = [
        { icon: <Brain size={22} />, title: 'Resume Intelligence', desc: 'AI-powered resume analysis with strength scoring, skill gap detection, and improvement recommendations.', badge: 'AI Analysis', color: 'text-violet-400' },
        { icon: <Zap size={22} />, title: 'Adaptive Quizzes', desc: 'Dynamic quiz generation that adapts to your weak areas, mistake patterns, and difficulty progression.', badge: 'Personalized', color: 'text-fuchsia-400' },
        { icon: <Code2 size={22} />, title: 'AI Assignments', desc: 'Personalized coding tasks, mini-projects, and case studies with automated AI evaluation.', badge: 'Auto-Graded', color: 'text-cyan-400' },
        { icon: <TrendingUp size={22} />, title: 'Mastery Tracking', desc: 'Real-time topic mastery heatmap, performance trends, and adaptive difficulty scaling.', badge: 'Real-time', color: 'text-emerald-400' },
        { icon: <BookOpen size={22} />, title: 'Smart Study Plans', desc: 'AI-generated daily study plans based on your risk topics, deadlines, and learning patterns.', badge: 'Adaptive', color: 'text-amber-400' },
        { icon: <Rocket size={22} />, title: 'Career Readiness', desc: 'Comprehensive readiness scoring combining quiz, assignment, resume, and consistency metrics.', badge: 'Score Based', color: 'text-rose-400' },
    ];

    const steps = [
        { num: '01', title: 'Upload Resume', desc: 'Instant AI analysis and parsing', icon: <FileText size={24} /> },
        { num: '02', title: 'Adaptive Learning', desc: 'Personalized quizzes & tasks', icon: <Cpu size={24} /> },
        { num: '03', title: 'Track Mastery', desc: 'Real-time skill heatmap', icon: <BarChart3 size={24} /> },
        { num: '04', title: 'Get Placed', desc: 'Achieve career readiness', icon: <Award size={24} /> },
    ];

    const testimonials = [
        { name: "Sarah J.", role: "Software Engineer @ Google", text: "ACIE's adaptive quizzes found exactly where my data structures knowledge was weak and fixed it before my interviews.", initial: "S" },
        { name: "Michael R.", role: "Data Scientist @ Meta", text: "The resume analyzer told me exactly what I was missing. I updated it based on the AI feedback and got 3 interviews the next week.", initial: "M" },
        { name: "Priya K.", role: "Frontend Dev @ Amazon", text: "Having a daily study plan generated for me removed all the overwhelming feelings of prep. I just logged in and did what was recommended.", initial: "P" }
    ];

    const faqs = [
        { q: "Is ACIE really powered by AI?", a: "Yes, we use advanced LLMs (like Google Gemini) to analyze your resume, generate dynamic questions, and grade your coding assignments subjectively." },
        { q: "How is the Readiness Score calculated?", a: "It's a weighted average of your quiz performance (50%), assignment completion (30%), and platform consistency (20%), constantly adapting as you improve." },
        { q: "Is this platform free?", a: "We offer a generous completely free tier that includes basic resume analysis and a limited number of quizzes per week. Premium features unlock unlimited AI generations." },
        { q: "Do the mock interviews support voice/video?", a: "Yes! Our mock interview module supports live audio transcription to grade your verbal communication clarity and technical correctness." }
    ];

    const [openFaq, setOpenFaq] = useState(0);

    return (
        <div className="overflow-hidden bg-dark-950">
            {/* ═══════════════════════ HERO ═══════════════════════ */}
            <section className="relative min-h-screen flex items-center pt-32 sm:pt-40 pb-20">
                <div className="absolute inset-0 bg-hero-gradient opacity-50" />
                <div className="absolute inset-0 dot-grid opacity-30" />
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500 rounded-full blur-[150px]" />
                <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 10, delay: 2, repeat: Infinity }} className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-500 rounded-full blur-[120px]" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center lg:text-left">
                            <motion.div variants={fadeUp} className="mb-6">
                                <Badge variant="cyber" className="px-4 py-1.5 backdrop-blur-md">
                                    <Sparkles size={14} className="mr-2" />
                                    AI-Powered Preparation
                                </Badge>
                            </motion.div>

                            <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-7xl font-display font-black leading-tight mb-6">
                                <span className="text-white block">Master Skills.</span>
                                <span className="gradient-text block mt-1">Ace the Interview.</span>
                            </motion.h1>

                            <motion.p variants={fadeUp} className="text-lg text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
                                ACIE adapts to your weaknesses, generates personalized study paths, and <strong className="text-white font-medium">quantifies your career readiness</strong> with real-time AI analysis.
                            </motion.p>

                            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <Link to="/signup">
                                    <Button size="lg" className="w-full sm:w-auto shadow-primary-500/25 shadow-lg">
                                        Start Assessment
                                        <ArrowRight size={18} />
                                    </Button>
                                </Link>
                                <Link to="/resume">
                                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                                        <FileText size={18} />
                                        Build Resume
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Hero Visual Mockup */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            <GlassCard className="relative z-10 p-2 overflow-hidden shadow-premium">
                                <div className="bg-dark-900 rounded-xl overflow-hidden border border-white/5">
                                    {/* App Header bar */}
                                    <div className="bg-dark-950 px-4 py-3 flex items-center justify-between border-b border-white/5">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                                            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                                        </div>
                                        <div className="text-xs text-gray-500 font-mono">acie.ai / dashboard</div>
                                        <div className="w-16" />
                                    </div>
                                    {/* App body */}
                                    <div className="p-6 grid gap-4">
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <div className="text-sm text-gray-400">Readiness Score</div>
                                                <div className="text-4xl font-display font-bold gradient-text">84%</div>
                                            </div>
                                            <Badge variant="success">Interview Ready</Badge>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Top Weaknesses</div>
                                            {[
                                                { t: 'Dynamic Programming', p: 45, c: 'bg-red-500' },
                                                { t: 'System Design', p: 60, c: 'bg-amber-500' },
                                                { t: 'React Hooks', p: 92, c: 'bg-emerald-500' }
                                            ].map((w, i) => (
                                                <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/5">
                                                    <div className="flex justify-between text-sm mb-2 text-gray-300">
                                                        <span>{w.t}</span>
                                                        <span>{w.p}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-dark-700 rounded-full overflow-hidden">
                                                        <motion.div initial={{ width: 0 }} animate={{ width: `${w.p}%` }} transition={{ delay: 1 + (i * 0.2), duration: 1 }} className={`h-full ${w.c}`} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Floating decorative elements */}
                            <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -right-12 top-10 z-20">
                                <GlassCard className="p-4 flex items-center gap-3 shadow-xl">
                                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400">
                                        <Brain size={20} />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400">New Insight Insight</div>
                                        <div className="text-sm font-semibold text-white">Graphs mastery improved!</div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ LOGOS / SOCIAL PROOF ═══════════════════════ */}
            <section className="py-10 border-y border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-sm text-gray-500 font-medium mb-6 tracking-widest uppercase">Trusted by students landing jobs at</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'].map((company, i) => (
                            <span key={i} className="text-xl font-display font-bold text-white">{company}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ HOW IT WORKS (TIMELINE) ═══════════════════════ */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <Badge variant="accent" className="mb-4">Workflow</Badge>
                        <h2 className="section-title mb-4">How <span className="gradient-text-alt">ACIE Works</span></h2>
                        <p className="section-subtitle">Your four steps from preparation to placement.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                        {/* Connecting line */}
                        <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary-500/0 via-primary-500/50 to-primary-500/0 z-0" />

                        {steps.map((s, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full glass flex items-center justify-center mb-6 shadow-glow-primary border-primary-500/30 text-primary-400 relative">
                                    {s.icon}
                                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-dark-900 border border-white/10 flex items-center justify-center text-xs font-bold font-mono text-white">
                                        {s.num}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                                <p className="text-sm text-gray-400 px-4">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ FEATURE GRID ═══════════════════════ */}
            <section className="py-24 relative bg-dark-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <h2 className="section-title mb-4">Core <span className="gradient-text">Intelligence</span></h2>
                            <p className="section-subtitle mx-0">Everything you need to analyze, prepare, and verify your skills in one unified platform.</p>
                        </div>
                        <Button variant="secondary">View All Features</Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <Card key={i} glow={true} className="group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform ${f.color}`}>
                                        {f.icon}
                                    </div>
                                    <Badge variant="neutral">{f.badge}</Badge>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ TESTIMONIALS ═══════════════════════ */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/10 rounded-full blur-[100px]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="section-title mb-4">Success <span className="text-white text- glow">Stories</span></h2>
                        <p className="section-subtitle">Hear from students who landed their dream roles.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <GlassCard key={i} className="flex flex-col justify-between">
                                <div>
                                    <Quote size={32} className="text-white/10 mb-4" />
                                    <p className="text-gray-300 italic mb-6">"{t.text}"</p>
                                </div>
                                <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-cyber-500 flex items-center justify-center font-bold text-white">
                                        {t.initial}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white text-sm">{t.name}</div>
                                        <div className="text-xs text-accent-400">{t.role}</div>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ FAQ ═══════════════════════ */}
            <section className="py-24 bg-dark-900">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="section-title mb-4">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border border-white/10 rounded-xl overflow-hidden bg-dark-950">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                                >
                                    <span className="font-medium text-white">{faq.q}</span>
                                    {openFaq === i ? <Minus size={18} className="text-gray-400" /> : <Plus size={18} className="text-gray-400" />}
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-5 pt-0 text-sm text-gray-400 leading-relaxed border-t border-white/5">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ CTA FOOTER ═══════════════════════ */}
            <section className="py-24 relative text-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_0%,rgba(99,102,241,0.1),transparent)]" />
                <div className="max-w-3xl mx-auto px-4 relative z-10">
                    <h2 className="text-4xl sm:text-5xl font-display font-black mb-6">Stop guessing. <br />Start measuring.</h2>
                    <p className="text-xl text-gray-400 mb-10">Use AI to quantify your readiness today.</p>
                    <Link to="/signup">
                        <Button size="lg" className="mx-auto shadow-xl shadow-primary-500/20">
                            Create Free Account
                            <ArrowRight size={20} className="ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
