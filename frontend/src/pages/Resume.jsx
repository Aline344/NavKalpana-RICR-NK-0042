import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    Upload, FileText, CheckCircle, AlertTriangle, Lightbulb,
    Code2, Briefcase, GraduationCap, Sparkles, BarChart3,
    TrendingUp, ChevronRight, Info, Target, Plus, X
} from 'lucide-react';
import { NeuralLoading } from '../components/LoadingSkeletons';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const Resume = () => {
    const { user } = useAuth();
    const [resumeText, setResumeText] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [targetRole, setTargetRole] = useState(user?.targetRole || 'Full Stack Developer');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('paste');
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const roles = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'DevOps Engineer', 'Mobile Developer', 'Product Manager', 'UX Designer'];

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            if (file.size > 5 * 1024 * 1024) {
                setError('File size exceeds 5MB limit.');
                return;
            }
            setSelectedFile(file);
            setError(null);
        } else {
            setError('Please upload a valid PDF file.');
        }
    };

    const handleAnalyze = async () => {
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('targetRole', targetRole);

            if (activeTab === 'paste') {
                if (!resumeText.trim()) throw new Error('Please paste your resume text.');
                formData.append('resumeText', resumeText);
            } else {
                if (!selectedFile) throw new Error('Please select a PDF file.');
                formData.append('resumeFile', selectedFile);
            }

            const { data } = await axios.post('/api/resume/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setAnalysis(data);
        } catch (err) {
            console.error('Resume analysis error:', err);
            setError(err.response?.data?.message || err.message || 'Analysis failed. Please try again.');
        }
        setLoading(false);
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 60) return 'text-amber-400';
        return 'text-red-400';
    };

    const getScoreBg = (score) => {
        if (score >= 80) return 'bg-emerald-500/20 border-emerald-500/30';
        if (score >= 60) return 'bg-amber-500/20 border-amber-500/30';
        return 'bg-red-500/20 border-red-500/30';
    };

    return (
        <div className="pt-24 pb-16 min-h-screen">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05)_0%,rgba(0,0,0,0)_50%)] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">

                    {/* Header Section */}
                    <motion.div variants={fadeUp} className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-full mb-6 border-white/10 shadow-xl"
                        >
                            <Sparkles size={14} className="text-primary-400 animate-pulse" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-300">Resume Intelligence v2.0</span>
                        </motion.div>
                        <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight mb-4">
                            Master Your <span className="gradient-text">Preparation Strategy</span>
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Our AI extracts skills, projects, and keywords to calculate your strength score before you even step into the interview.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* Left Column: Input Panel */}
                        <motion.div variants={fadeUp} className="lg:col-span-5 space-y-6">
                            <div className="glass-strong rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                                <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center border border-primary-500/30">
                                                <Target size={20} className="text-primary-400" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-white leading-none">Target Career</h2>
                                                <p className="text-xs text-gray-500 mt-1">Optimize analysis for this role</p>
                                            </div>
                                        </div>
                                    </div>
                                    <select
                                        value={targetRole}
                                        onChange={e => setTargetRole(e.target.value)}
                                        className="w-full bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        {roles.map(r => <option key={r} value={r} className="bg-dark-900">{r}</option>)}
                                    </select>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="flex p-1 bg-dark-900/50 rounded-xl border border-white/5">
                                        {[
                                            { id: 'paste', label: 'Paste Text', icon: <FileText size={14} /> },
                                            { id: 'upload', label: 'PDF Upload', icon: <Upload size={14} /> }
                                        ].map(tab => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id
                                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                {tab.icon} {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="relative">
                                        {activeTab === 'paste' ? (
                                            <textarea
                                                value={resumeText}
                                                onChange={e => setResumeText(e.target.value)}
                                                className="w-full h-64 bg-dark-900/40 border border-white/10 rounded-2xl p-5 text-sm leading-relaxed text-gray-300 placeholder:text-gray-600 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 outline-none transition-all resize-none font-mono"
                                                placeholder="Paste your professional highlights, skill list, and experience..."
                                            />
                                        ) : (
                                            <div
                                                onClick={() => fileInputRef.current.click()}
                                                className={`group h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all cursor-pointer ${selectedFile
                                                    ? 'border-emerald-500/30 bg-emerald-500/5'
                                                    : 'border-white/10 hover:border-primary-500/50 hover:bg-white/[0.02]'
                                                    }`}
                                            >
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    accept=".pdf"
                                                    className="hidden"
                                                />
                                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 ${selectedFile ? 'bg-emerald-500/20' : 'bg-white/5'
                                                    }`}>
                                                    {selectedFile ? <CheckCircle size={32} className="text-emerald-400" /> : <Upload size={32} className="text-gray-500" />}
                                                </div>
                                                <h3 className="text-white font-bold mb-1">
                                                    {selectedFile ? selectedFile.name : 'Choose Resume PDF'}
                                                </h3>
                                                <p className="text-xs text-gray-500 text-center max-w-[200px]">
                                                    {selectedFile ? 'Ready to analyze your file' : 'Click or drag and drop to extract your professional data'}
                                                </p>
                                                {selectedFile && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                                                        className="mt-4 text-[10px] text-red-400 hover:text-red-300 transition-colors uppercase font-bold tracking-widest flex items-center gap-1"
                                                    >
                                                        <X size={10} /> Remove File
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {error && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                            className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                                            <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
                                            <p className="text-xs text-red-300 font-medium">{error}</p>
                                        </motion.div>
                                    )}

                                    <button
                                        onClick={handleAnalyze}
                                        disabled={loading || (activeTab === 'paste' ? !resumeText.trim() : !selectedFile)}
                                        className="relative group w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 py-4 rounded-2xl font-bold text-white shadow-xl shadow-primary-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none overflow-hidden"
                                    >
                                        <div className="relative flex items-center justify-center gap-3 z-10">
                                            {loading ? (
                                                <><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Analyzing Dynamics...</>
                                            ) : (
                                                <><Sparkles size={18} /> Generate Strength Analysis</>
                                            )}
                                        </div>
                                        {loading && (
                                            <motion.div
                                                initial={{ left: '-100%' }}
                                                animate={{ left: '100%' }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                className="absolute top-0 bottom-0 w-1/2 bg-white/20 skew-x-12 -z-0"
                                            />
                                        )}
                                    </button>


                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column: Results Panel */}
                        <motion.div variants={fadeUp} className="lg:col-span-7">
                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <NeuralLoading type="assignment" />
                                    </motion.div>
                                ) : analysis ? (
                                    <motion.div
                                        key="results"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                            {/* Score Ring */}
                                            <div className="md:col-span-5 glass-strong p-8 rounded-3xl text-center flex flex-col items-center justify-center border border-white/10 shadow-lg">
                                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-6">Aggregate Power</h3>
                                                <div className="relative w-40 h-40">
                                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                                                        <motion.circle
                                                            cx="50" cy="50" r="45" fill="none"
                                                            stroke="url(#resGrad)" strokeWidth="8" strokeLinecap="round"
                                                            initial={{ strokeDasharray: "0 283" }}
                                                            animate={{ strokeDasharray: `${(analysis.strengthScore / 100) * 283} 283` }}
                                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                                        />
                                                        <defs>
                                                            <linearGradient id="resGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                                <stop offset="0%" stopColor="#6366f1" />
                                                                <stop offset="100%" stopColor="#ec4899" />
                                                            </linearGradient>
                                                        </defs>
                                                    </svg>
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <span className="text-5xl font-display font-black text-white">{analysis.strengthScore}</span>
                                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">/ 100</span>
                                                    </div>
                                                </div>
                                                <div className={`mt-6 px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider ${getScoreBg(analysis.strengthScore)} ${getScoreColor(analysis.strengthScore)}`}>
                                                    {analysis.strengthScore >= 80 ? 'Market Ready' : analysis.strengthScore >= 60 ? 'Competitive' : 'Developing'}
                                                </div>
                                            </div>

                                            {/* Dimensional Breakdown */}
                                            <div className="md:col-span-7 glass-strong p-8 rounded-3xl border border-white/10">
                                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                                                    <BarChart3 size={14} className="text-primary-400" /> Scoring Dimensions
                                                </h3>
                                                <div className="space-y-5">
                                                    {[
                                                        { label: 'Skill Relevance', value: analysis.breakdown?.skillRelevance, weight: '40%' },
                                                        { label: 'Project Depth', value: analysis.breakdown?.projectDepth, weight: '30%' },
                                                        { label: 'Experience Context', value: analysis.breakdown?.experienceScore, weight: '20%' },
                                                        { label: 'Documentation Structure', value: analysis.breakdown?.structureScore, weight: '10%' }
                                                    ].map((item, i) => (
                                                        <div key={i} className="space-y-2">
                                                            <div className="flex justify-between items-end">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs font-bold text-gray-300">{item.label}</span>
                                                                    <span className="text-[9px] text-gray-600 font-mono">w: {item.weight}</span>
                                                                </div>
                                                                <span className={`text-xs font-black ${getScoreColor(item.value)}`}>{item.value}%</span>
                                                            </div>
                                                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${item.value}%` }}
                                                                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                                                    className={`h-full rounded-full bg-gradient-to-r ${item.value >= 80 ? 'from-emerald-500 to-emerald-400' :
                                                                        item.value >= 60 ? 'from-amber-500 to-amber-400' :
                                                                            'from-red-600 to-red-400'
                                                                        }`}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Capabilities Summary */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="glass-strong p-6 rounded-3xl border border-white/5">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                        <CheckCircle size={16} className="text-emerald-400" />
                                                    </div>
                                                    <h3 className="text-sm font-bold text-white">Detected Skills</h3>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {analysis.foundSkills?.map((s, i) => (
                                                        <span key={i} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400 hover:text-white transition-colors">
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="glass-strong p-6 rounded-3xl border border-white/5">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                                        <AlertTriangle size={16} className="text-amber-400" />
                                                    </div>
                                                    <h3 className="text-sm font-bold text-white">Missing Assets</h3>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {analysis.missingSkills?.map((s, i) => (
                                                        <span key={i} className="px-2.5 py-1 bg-amber-500/5 border border-amber-500/10 rounded-lg text-[10px] font-bold text-amber-400/70">
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actionable Recommendations */}
                                        <div className="glass-strong p-8 rounded-3xl border border-white/10">
                                            <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary-400 mb-6 flex items-center gap-2">
                                                <Lightbulb size={16} /> Strategy Enhancements
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                                {analysis.recommendations?.map((r, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: 1 + (i * 0.1) }}
                                                        className="flex items-start gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.04] transition-all"
                                                    >
                                                        <div className="mt-1 w-5 h-5 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/30 transition-colors">
                                                            <ChevronRight size={12} className="text-primary-400" />
                                                        </div>
                                                        <p className="text-xs text-gray-400 leading-relaxed font-medium group-hover:text-gray-300 transition-colors">
                                                            {r}
                                                        </p>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="placeholder"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="h-full min-h-[500px] glass-strong rounded-[40px] border border-white/5 flex flex-col items-center justify-center p-12 text-center"
                                    >
                                        <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-white/5 to-white/0 flex items-center justify-center mb-8 border border-white/10 shadow-2xl relative">
                                            <div className="absolute inset-0 bg-primary-500/10 blur-2xl rounded-full" />
                                            <BarChart3 size={40} className="text-gray-600 relative z-10" />
                                        </div>
                                        <h3 className="text-2xl font-display font-bold text-white mb-4">Initialize Analysis</h3>
                                        <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-8">
                                            Our neural engine is ready to process your professional data. Upload a PDF or paste your credentials to calculate your career strength.
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                                <TrendingUp size={16} className="text-primary-400 mb-2 mx-auto" />
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Real-time DB Sync</p>
                                            </div>
                                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                                <Briefcase size={16} className="text-accent-400 mb-2 mx-auto" />
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Role Mapping</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Resume;
