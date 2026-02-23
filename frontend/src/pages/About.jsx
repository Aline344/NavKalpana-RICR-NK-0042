import { motion } from 'framer-motion';
import { Brain, Target, Rocket, Users, Lightbulb, TrendingUp, Globe, Handshake, Sparkles } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.15 } } };

const About = () => {
    const values = [
        { icon: <Target size={20} />, title: 'Mission', desc: 'To create a measurable, adaptive, and intelligent career preparation ecosystem that bridges the gap between learning and placement.', color: 'from-primary-500 to-primary-700' },
        { icon: <Rocket size={20} />, title: 'Vision', desc: 'Empowering every student with AI-driven tools that identify weaknesses, optimize preparation, and quantify career readiness.', color: 'from-accent-500 to-accent-700' },
        { icon: <Handshake size={20} />, title: 'Impact', desc: 'Connecting Learning → Skill Development → Interview Performance → Career Readiness in one seamless platform.', color: 'from-cyber-500 to-cyber-700' },
    ];

    const pillars = [
        { icon: <Brain size={20} />, title: 'AI-Powered Analysis', desc: 'Resume intelligence, skill extraction, and gap detection using advanced AI algorithms.' },
        { icon: <Lightbulb size={20} />, title: 'Adaptive Learning', desc: 'Dynamic difficulty scaling based on performance, mistake patterns, and mastery progression.' },
        { icon: <TrendingUp size={20} />, title: 'Real-time Tracking', desc: 'Continuous mastery updates with the formula: (Quiz×0.50) + (Assignment×0.30) + (Consistency×0.20).' },
        { icon: <Globe size={20} />, title: 'Career Mapping', desc: 'Role-specific preparation paths for Frontend, Backend, Full Stack, Data Science, DevOps, and more.' },
    ];

    const team = [
        { name: 'Team ACIE', role: 'Full Stack Development', avatar: 'A', gradient: 'from-primary-500 to-accent-500' },
        { name: 'AI Engine', role: 'Intelligence & Algorithms', avatar: 'AI', gradient: 'from-accent-500 to-cyber-500' },
        { name: 'Innovation Lab', role: 'Research & Design', avatar: 'IL', gradient: 'from-cyber-500 to-primary-500' },
    ];

    return (
        <div className="pt-32 pb-10 overflow-hidden">
            {/* Hero */}
            <section className="relative py-20">
                <div className="absolute inset-0 bg-hero-gradient" />
                <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary-500/15 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl" />

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div initial="hidden" animate="visible" variants={stagger}>
                        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6">
                            <Sparkles size={14} className="text-primary-400" />
                            <span className="text-sm text-gray-300">About ACIE</span>
                        </motion.div>
                        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6">
                            <span className="text-white">Redefining </span>
                            <span className="gradient-text">Career Preparation</span>
                        </motion.h1>
                        <motion.p variants={fadeUp} className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            ACIE is an AI-powered preparation-to-placement platform that continuously adapts strategies based on measurable performance signals.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {values.map((v, i) => (
                            <motion.div key={i} variants={fadeUp} className="glass-card text-center">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center text-white text-xl mx-auto mb-4`}>
                                    {v.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{v.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Core Pillars */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
                        <motion.h2 variants={fadeUp} className="section-title">
                            <span className="gradient-text">Core Pillars</span>
                        </motion.h2>
                        <motion.p variants={fadeUp} className="section-subtitle mt-4">The foundation of ACIE's intelligence engine</motion.p>
                    </motion.div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {pillars.map((p, i) => (
                            <motion.div key={i} variants={fadeUp} className="glass-card">
                                <div className="text-2xl text-primary-400 mb-3">{p.icon}</div>
                                <h3 className="text-white font-semibold mb-2">{p.title}</h3>
                                <p className="text-gray-400 text-sm">{p.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* System Architecture */}
            <section className="py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
                        <motion.h2 variants={fadeUp} className="section-title"><span className="gradient-text">System Architecture</span></motion.h2>
                    </motion.div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                        className="glass-strong p-6 sm:p-8 rounded-3xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass p-5 rounded-xl border-l-4 border-primary-500">
                                <h3 className="text-lg font-semibold text-primary-400 mb-3">Part 1 – Learning Intelligence (~70%)</h3>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex items-start gap-2"><span className="text-primary-400 mt-1">●</span> Authentication & User Management</li>
                                    <li className="flex items-start gap-2"><span className="text-primary-400 mt-1">●</span> Resume Intelligence Module</li>
                                    <li className="flex items-start gap-2"><span className="text-primary-400 mt-1">●</span> Adaptive Quiz Engine</li>
                                    <li className="flex items-start gap-2"><span className="text-primary-400 mt-1">●</span> AI Assignment Generator</li>
                                    <li className="flex items-start gap-2"><span className="text-primary-400 mt-1">●</span> Mastery Tracking & Study Plans</li>
                                </ul>
                            </div>
                            <div className="glass p-5 rounded-xl border-l-4 border-accent-500">
                                <h3 className="text-lg font-semibold text-accent-400 mb-3">Part 2 – Interview Intelligence (~30%)</h3>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex items-start gap-2"><span className="text-accent-400 mt-1">●</span> Interview Simulation</li>
                                    <li className="flex items-start gap-2"><span className="text-accent-400 mt-1">●</span> Readiness Scoring</li>
                                    <li className="flex items-start gap-2"><span className="text-accent-400 mt-1">●</span> Placement Optimization</li>
                                    <li className="flex items-start gap-2"><span className="text-accent-400 mt-1">●</span> Career Intelligence</li>
                                    <li className="flex items-start gap-2"><span className="text-accent-400 mt-1">○</span> Coming Soon</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Team */}
            <section className="py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
                        <motion.h2 variants={fadeUp} className="section-title"><span className="gradient-text">Our Team</span></motion.h2>
                    </motion.div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {team.map((t, i) => (
                            <motion.div key={i} variants={fadeUp} className="glass-card text-center">
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-lg font-bold mx-auto mb-4`}>
                                    {t.avatar}
                                </div>
                                <h3 className="text-white font-semibold">{t.name}</h3>
                                <p className="text-gray-400 text-sm mt-1">{t.role}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;
