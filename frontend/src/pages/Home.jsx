import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
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
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const features = [
        { icon: <Brain size={22} />, title: 'Resume Intelligence', desc: 'AI-powered resume analysis with strength scoring, skill gap detection, and improvement recommendations.', badge: 'AI Analysis', color: 'text-indigo-500 bg-indigo-50' },
        { icon: <Zap size={22} />, title: 'Adaptive Quizzes', desc: 'Dynamic quiz generation that adapts to your weak areas, mistake patterns, and difficulty progression.', badge: 'Personalized', color: 'text-amber-500 bg-amber-50' },
        { icon: <Code2 size={22} />, title: 'AI Assignments', desc: 'Personalized coding tasks, mini-projects, and case studies with automated AI evaluation.', badge: 'Auto-Graded', color: 'text-emerald-500 bg-emerald-50' },
        { icon: <TrendingUp size={22} />, title: 'Mastery Tracking', desc: 'Real-time topic mastery heatmap, performance trends, and adaptive difficulty scaling.', badge: 'Real-time', color: 'text-blue-500 bg-blue-50' },
        { icon: <BookOpen size={22} />, title: 'Smart Study Plans', desc: 'AI-generated daily study plans based on your risk topics, deadlines, and learning patterns.', badge: 'Adaptive', color: 'text-purple-500 bg-purple-50' },
        { icon: <Rocket size={22} />, title: 'Career Readiness', desc: 'Comprehensive readiness scoring combining quiz, assignment, resume, and consistency metrics.', badge: 'Score Based', color: 'text-rose-500 bg-rose-50' },
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
        <div className="overflow-hidden bg-background">
            {/* Scroll Progress Indicator */}
            <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-500 to-amber-500 origin-left z-[10000]" style={{ scaleX }} />

            {/* ═══════════════════════ HERO ═══════════════════════ */}
            <section className="relative min-h-screen flex items-center pt-32 sm:pt-40 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-hero-mesh opacity-30" />
                <div className="absolute inset-0 dot-grid opacity-50" />
                <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent-200 rounded-full blur-[150px]" />
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 12, delay: 2, repeat: Infinity, ease: "linear" }} className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-300 rounded-full blur-[120px]" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div initial="hidden" animate="visible" variants={stagger} className="text-center lg:text-left">
                            <motion.div variants={fadeUp} className="mb-6">
                                <Badge variant="accent" className="px-4 py-1.5 backdrop-blur-md bg-white/70 shadow-sm border border-accent-200">
                                    <Sparkles size={14} className="mr-2 text-amber-500" />
                                    AI-Powered Preparation
                                </Badge>
                            </motion.div>

                            <motion.h1 variants={fadeUp} className="text-6xl sm:text-7xl md:text-8xl font-display font-black leading-[1.1] tracking-tight mb-6">
                                <span className="text-foreground block">Master Skills.</span>
                                <span className="gradient-text block mt-1">Ace the Interview.</span>
                            </motion.h1>

                            <motion.p variants={fadeUp} className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 font-medium">
                                ACIE adapts to your weaknesses, generates personalized study paths, and <strong className="text-foreground font-semibold">quantifies your career readiness</strong> with real-time AI analysis.
                            </motion.p>

                            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <Link to="/signup">
                                    <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-accent-500/20 text-base">
                                        Start Assessment
                                        <ArrowRight size={18} />
                                    </Button>
                                </Link>
                                <Link to="/resume">
                                    <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base">
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
                            <div className="relative z-10 p-2 overflow-hidden shadow-2xl shadow-gray-200/50 rounded-[24px] bg-white border border-gray-100">
                                <div className="bg-gray-50/50 rounded-xl overflow-hidden border border-gray-100">
                                    {/* App Header bar */}
                                    <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 shadow-sm relative z-10">
                                        <div className="flex gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-400" />
                                            <div className="w-3 h-3 rounded-full bg-amber-400" />
                                            <div className="w-3 h-3 rounded-full bg-emerald-400" />
                                        </div>
                                        <div className="text-xs text-gray-400 font-mono font-medium">acie.ai / dashboard</div>
                                        <div className="w-16" />
                                    </div>
                                    {/* App body */}
                                    <div className="p-8 grid gap-6 bg-white/40 backdrop-blur-sm">
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <div className="text-sm text-muted-foreground font-semibold mb-1 uppercase tracking-wider">Readiness Score</div>
                                                <div className="text-5xl font-display font-black gradient-text">84%</div>
                                            </div>
                                            <Badge variant="success" className="px-3 py-1 shadow-sm">Interview Ready</Badge>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-gray-100">
                                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Weaknesses</div>
                                            {[
                                                { t: 'Dynamic Programming', p: 45, c: 'bg-red-500' },
                                                { t: 'System Design', p: 60, c: 'bg-amber-500' },
                                                { t: 'React Hooks', p: 92, c: 'bg-emerald-500' }
                                            ].map((w, i) => (
                                                <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                                                    <div className="flex justify-between text-sm mb-3 text-gray-600 font-medium">
                                                        <span>{w.t}</span>
                                                        <span className="text-gray-900 font-bold">{w.p}%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                        <motion.div initial={{ width: 0 }} animate={{ width: `${w.p}%` }} transition={{ delay: 1 + (i * 0.2), duration: 1 }} className={`h-full ${w.c} rounded-full`} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating decorative elements */}
                            <motion.div animate={{ y: [-15, 15, -15] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-12 top-20 z-20">
                                <div className="p-4 bg-white/90 backdrop-blur-xl border border-white rounded-[20px] shadow-lg flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
                                        <TrendingUp size={24} />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Insight</div>
                                        <div className="text-sm font-bold text-foreground">Graphs mastery improved!</div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ LOGOS / SOCIAL PROOF ═══════════════════════ */}
            <section className="py-12 border-y border-border bg-white/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-xs text-gray-400 font-semibold mb-6 tracking-widest uppercase">Trusted by students landing jobs at</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        {['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix'].map((company, i) => (
                            <span key={i} className="text-2xl font-display font-black text-gray-900">{company}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ HOW IT WORKS (TIMELINE) ═══════════════════════ */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} className="text-center mb-20">
                        <Badge variant="accent" className="mb-6">Workflow</Badge>
                        <h2 className="section-title mb-4">How <span className="gradient-text">ACIE Works</span></h2>
                        <p className="section-subtitle">Your four steps from preparation to placement.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                        {/* Connecting line */}
                        <div className="hidden lg:block absolute top-[3rem] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent z-0" />

                        {steps.map((s, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: i * 0.1 }}
                                key={i} className="relative z-10 flex flex-col items-center text-center"
                            >
                                <div className="w-24 h-24 rounded-[24px] bg-white border border-gray-100 flex items-center justify-center mb-6 shadow-sm shadow-gray-200/50 text-accent-500 relative group transition-all hover:shadow-led hover:-translate-y-2">
                                    {s.icon}
                                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-xs font-bold font-mono text-gray-700">
                                        {s.num}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">{s.title}</h3>
                                <p className="text-sm text-muted-foreground px-4 leading-relaxed">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ FEATURE GRID ═══════════════════════ */}
            <section className="py-32 relative bg-gray-50/50 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <h2 className="section-title mb-4">Core <span className="gradient-text">Intelligence</span></h2>
                            <p className="section-subtitle mx-0">Everything you need to analyze, prepare, and verify your skills in one unified platform.</p>
                        </div>
                        <Button variant="secondary" className="shadow-sm">View All Features</Button>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: i * 0.1 }}
                                key={i}
                            >
                                <Card glow={true} className="group h-full flex flex-col justify-between hover:border-gray-200 bg-white/60 backdrop-blur-md">
                                    <div>
                                        <div className="flex justify-between items-start mb-8">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm border border-white ${f.color}`}>
                                                {f.icon}
                                            </div>
                                            <Badge variant="neutral" className="bg-white">{f.badge}</Badge>
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-3">{f.title}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ TESTIMONIALS ═══════════════════════ */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-100/50 rounded-full blur-[120px]" />
                <div className="absolute left-0 top-0 w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-[100px]" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
                        <h2 className="section-title mb-4">Success <span className="text-accent-500 text-glow">Stories</span></h2>
                        <p className="section-subtitle">Hear from students who landed their dream roles.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                key={i}
                            >
                                <GlassCard className="flex flex-col justify-between h-full group bg-white border-gray-100 shadow-sm hover:shadow-led">
                                    <div>
                                        <Quote size={40} className="text-gray-100 mb-6 group-hover:text-accent-100 transition-colors" />
                                        <p className="text-gray-600 italic mb-8 font-medium leading-relaxed">"{t.text}"</p>
                                    </div>
                                    <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-500 to-amber-500 flex items-center justify-center font-bold text-lg text-white shadow-md">
                                            {t.initial}
                                        </div>
                                        <div>
                                            <div className="font-bold text-foreground text-sm">{t.name}</div>
                                            <div className="text-xs text-accent-600 font-medium mt-0.5">{t.role}</div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ FAQ ═══════════════════════ */}
            <section className="py-32 bg-white border-t border-gray-100">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <h2 className="section-title mb-4">Frequently Asked Questions</h2>
                    </motion.div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                                key={i} className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none bg-white"
                                >
                                    <span className="font-semibold text-foreground pr-8">{faq.q}</span>
                                    {openFaq === i ?
                                        <Minus size={20} className="text-accent-500 flex-shrink-0" /> :
                                        <Plus size={20} className="text-gray-400 flex-shrink-0" />
                                    }
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden bg-gray-50/50"
                                        >
                                            <div className="p-6 pt-0 text-sm text-gray-600 font-medium leading-relaxed border-t border-gray-100">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ CTA FOOTER ═══════════════════════ */}
            <section className="py-32 relative text-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(245,158,11,0.05),transparent)] pointer-events-none" />
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-3xl mx-auto px-4 relative z-10">
                    <h2 className="text-5xl sm:text-6xl font-display font-black mb-6 tracking-tight text-foreground">Stop guessing. <br /><span className="gradient-text">Start measuring.</span></h2>
                    <p className="text-xl text-muted-foreground mb-12 font-medium">Use AI to quantify your readiness today.</p>
                    <Link to="/signup">
                        <Button size="lg" className="mx-auto shadow-xl shadow-accent-500/20 text-lg px-8 py-4">
                            Create Free Account
                            <ArrowRight size={20} className="ml-2" />
                        </Button>
                    </Link>
                </motion.div>
            </section>
        </div>
    );
};

export default Home;
