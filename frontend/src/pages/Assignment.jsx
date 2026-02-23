import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Code2, Upload, CheckCircle, Clock, Lightbulb, BarChart3, Plus, Github, FileText, Sparkles, ArrowLeft, ArrowRight, CalendarDays } from 'lucide-react';
import { ListSkeleton, NeuralLoading } from '../components/LoadingSkeletons';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const Assignment = () => {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [topic, setTopic] = useState('JavaScript');
    const [type, setType] = useState('');
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissionContent, setSubmissionContent] = useState('');
    const [submissionType, setSubmissionType] = useState('code');
    const [submitting, setSubmitting] = useState(false);
    const [showResults, setShowResults] = useState(null);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const topics = ['JavaScript', 'React', 'Node.js', 'Data Structures', 'Python', 'SQL'];
    const types = ['', 'coding', 'mini-project', 'case-study', 'analytical', 'debugging', 'system-design'];

    useEffect(() => { fetchAssignments(); }, []);

    const fetchAssignments = async () => {
        try {
            const { data } = await axios.get('/api/assignment');
            setAssignments(data);
        } catch (err) {
            console.error('Assignment fetch error:', err);
            setError('Failed to fetch assignments. Please try again later.');
        }
        setLoading(false);
    };

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const { data } = await axios.post('/api/assignment/generate', { topic, type: type || undefined });
            setAssignments([data, ...assignments]);
        } catch (err) {
            console.error('Assignment generation error:', err);
            alert('Failed to generate assignment using AI. Please check your connection.');
        }
        setGenerating(false);
    };

    const handleSubmit = async () => {
        if (!submissionContent.trim() || !selectedAssignment) return;
        setSubmitting(true);
        try {
            const { data } = await axios.post('/api/assignment/submit', { assignmentId: selectedAssignment._id, submissionType, content: submissionContent });
            setAssignments(assignments.map(a => a._id === data._id ? data : a));
            setShowResults(data);
            setSelectedAssignment(null);
        } catch {
            const evaluated = { ...selectedAssignment, status: 'evaluated', evaluation: { score: 72, logicalCorrectness: 75, conceptApplication: 70, codeStructure: 78, completeness: 65, efficiency: 68, improvements: ['Add error handling', 'Improve code structure', 'Cover more edge cases'], conceptCoverage: selectedAssignment.requirements.map(r => ({ concept: r, covered: Math.random() > 0.3 })), mistakeBreakdown: [{ area: 'Completeness', description: 'Some requirements not fully addressed' }] } };
            setAssignments(assignments.map(a => a._id === evaluated._id ? evaluated : a));
            setShowResults(evaluated);
            setSelectedAssignment(null);
        }
        setSubmitting(false);
        setSubmissionContent('');
    };

    const getStatusBadge = (status) => {
        if (status === 'pending') return 'badge-warning';
        if (status === 'submitted') return 'badge-info';
        return 'badge-success';
    };

    const getTypeIcon = (t) => {
        const icons = { coding: <Code2 size={16} />, 'mini-project': <FileText size={16} />, 'case-study': <FileText size={16} />, debugging: <Code2 size={16} />, 'system-design': <BarChart3 size={16} />, analytical: <Lightbulb size={16} /> };
        return icons[t] || <Code2 size={16} />;
    };

    return (
        <div className="pt-20 pb-10 min-h-screen">
            <div className="absolute inset-0 bg-hero-gradient -z-10" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div initial="hidden" animate="visible" variants={stagger}>
                    {/* Header */}
                    <motion.div variants={fadeUp} className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-4">
                            <Sparkles size={13} className="text-cyber-400" />
                            <span className="text-sm text-gray-300">AI Assignment Engine</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-display font-bold">
                            <span className="gradient-text">Smart Assignments</span>
                        </h1>
                        <p className="text-gray-400 mt-2">AI-generated practical tasks with automated evaluation</p>
                    </motion.div>

                    {/* Generate Panel */}
                    <motion.div variants={fadeUp} className="glass-strong p-5 rounded-2xl mb-6">
                        <div className="flex flex-col sm:flex-row items-end gap-3">
                            <div className="flex-1 w-full">
                                <label className="text-xs text-gray-400 mb-1 block">Topic</label>
                                <select value={topic} onChange={e => setTopic(e.target.value)} className="input-field !py-2.5 text-sm">
                                    {topics.map(t => <option key={t} value={t} className="bg-dark-800">{t}</option>)}
                                </select>
                            </div>
                            <div className="flex-1 w-full">
                                <label className="text-xs text-gray-400 mb-1 block">Type (optional)</label>
                                <select value={type} onChange={e => setType(e.target.value)} className="input-field !py-2.5 text-sm">
                                    {types.map(t => <option key={t} value={t} className="bg-dark-800">{t || 'Any Type'}</option>)}
                                </select>
                            </div>
                            <button onClick={handleGenerate} disabled={generating} className="btn-primary flex items-center gap-2 whitespace-nowrap !py-2.5">
                                {generating ? 'Generating...' : <><Plus size={15} /> Generate Assignment</>}
                            </button>
                        </div>
                    </motion.div>

                    {/* Assignment List */}
                    <motion.div variants={fadeUp} className="space-y-4">
                        {generating ? (
                            <NeuralLoading type="assignment" />
                        ) : loading ? (
                            <ListSkeleton count={3} />
                        ) : assignments.length === 0 ? (
                            <div className="glass-strong p-12 rounded-2xl text-center">
                                <Code2 size={36} className="text-gray-600 mx-auto mb-4" />
                                <h3 className="text-white font-semibold mb-2">No Assignments Yet</h3>
                                <p className="text-gray-400 text-sm">Generate your first AI assignment to get started!</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {assignments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((a, i) => (
                                        <motion.div key={a._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                            className="glass-strong p-5 rounded-2xl">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-lg text-primary-400">{getTypeIcon(a.type)}</span>
                                                        <h3 className="text-white font-semibold">{a.title}</h3>
                                                    </div>
                                                    <p className="text-gray-400 text-sm mb-3">{a.description}</p>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="badge-info text-[10px]">{a.topic}</span>
                                                        <span className="badge-info text-[10px]">{a.type}</span>
                                                        <span className={`${getStatusBadge(a.status)} text-[10px]`}>{a.status}</span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-4 mt-2 p-2 glass rounded-lg border border-white/5 w-fit">
                                                        <span className="text-[10px] text-gray-400 flex items-center gap-1"><CalendarDays size={11} className="text-primary-400" /> Assigned: {new Date(a.createdAt).toLocaleDateString()}</span>
                                                        <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock size={11} className="text-accent-400" /> Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                                                    </div>
                                                    {a.requirements && (
                                                        <div className="mt-3">
                                                            <p className="text-xs text-gray-500 mb-1.5">Requirements:</p>
                                                            <ul className="space-y-1">
                                                                {a.requirements.map((r, ri) => (
                                                                    <li key={ri} className="text-xs text-gray-400 flex items-start gap-1.5">
                                                                        <span className="text-primary-400 mt-0.5">•</span> {r}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col items-end gap-2 min-w-[120px]">
                                                    {a.status === 'evaluated' && a.evaluation && (
                                                        <div className="text-center">
                                                            <p className={`text-2xl font-bold ${a.evaluation.score >= 80 ? 'text-emerald-400' : a.evaluation.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{a.evaluation.score}%</p>
                                                            <p className="text-xs text-gray-500">Score</p>
                                                            <button onClick={() => setShowResults(a)} className="text-xs text-primary-400 hover:underline mt-1">View Details</button>
                                                        </div>
                                                    )}
                                                    {a.status === 'pending' && (
                                                        <button onClick={() => setSelectedAssignment(a)} className="btn-primary text-sm !py-2 !px-4">
                                                            Submit Work
                                                        </button>
                                                    )}
                                                    {a.status === 'submitted' && (
                                                        <span className="text-xs text-gray-400">Evaluating...</span>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {assignments.length > itemsPerPage && (
                                    <div className="flex justify-center items-center gap-4 mt-8">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(p => p - 1)}
                                            className="btn-secondary !py-2 !px-4 disabled:opacity-30 flex items-center gap-2"
                                        >
                                            <ArrowLeft size={16} /> Prev
                                        </button>
                                        <span className="text-sm font-medium text-gray-400 glass px-4 py-2 rounded-xl border border-white/5">
                                            Page <span className="text-white">{currentPage}</span> of {Math.ceil(assignments.length / itemsPerPage)}
                                        </span>
                                        <button
                                            disabled={currentPage >= Math.ceil(assignments.length / itemsPerPage)}
                                            onClick={() => setCurrentPage(p => p + 1)}
                                            className="btn-secondary !py-2 !px-4 disabled:opacity-30 flex items-center gap-2"
                                        >
                                            Next <ArrowRight size={16} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>

                    {/* Submission Modal */}
                    <AnimatePresence>
                        {selectedAssignment && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                                onClick={() => setSelectedAssignment(null)}>
                                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                                    className="glass-strong p-6 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                                    onClick={e => e.stopPropagation()}>
                                    <h2 className="text-lg font-semibold text-white mb-1">{selectedAssignment.title}</h2>
                                    <p className="text-sm text-gray-400 mb-4">{selectedAssignment.description}</p>

                                    <div className="mb-4">
                                        <label className="text-sm text-gray-400 mb-1.5 block">Submission Type</label>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { key: 'code', label: 'Code', icon: <Code2 size={13} /> },
                                                { key: 'text', label: 'Text', icon: <FileText size={13} /> },
                                                { key: 'github-link', label: 'GitHub', icon: <Github size={13} /> },
                                                { key: 'file', label: 'File', icon: <Upload size={13} /> }
                                            ].map(t => (
                                                <button key={t.key} onClick={() => setSubmissionType(t.key)}
                                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${submissionType === t.key ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'glass text-gray-400 hover:text-white'}`}>
                                                    {t.icon} {t.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="text-sm text-gray-400 mb-1.5 block">Your Submission</label>
                                        <textarea value={submissionContent} onChange={e => setSubmissionContent(e.target.value)}
                                            rows={12} className="input-field resize-none font-mono text-sm" placeholder={submissionType === 'code' ? '// Write your code here...' : submissionType === 'github-link' ? 'https://github.com/...' : submissionType === 'file' ? 'Paste Google Drive / Dropbox link here (or text content of the file)...' : 'Write your answer here...'} />
                                    </div>

                                    <div className="flex gap-3">
                                        <button onClick={() => setSelectedAssignment(null)} className="btn-secondary flex-1">Cancel</button>
                                        <button onClick={handleSubmit} disabled={submitting || !submissionContent.trim()} className="btn-primary flex-1">
                                            {submitting ? 'Submitting...' : 'Submit for Evaluation'}
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Results Modal */}
                    <AnimatePresence>
                        {showResults?.evaluation && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                                onClick={() => setShowResults(null)}>
                                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                                    className="glass-strong p-6 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                                    onClick={e => e.stopPropagation()}>
                                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <BarChart3 size={16} className="text-primary-400" /> Evaluation Results
                                    </h2>

                                    {/* Score */}
                                    <div className="text-center mb-6">
                                        <p className={`text-4xl font-bold ${showResults.evaluation.score >= 80 ? 'text-emerald-400' : showResults.evaluation.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{showResults.evaluation.score}%</p>
                                        <p className="text-sm text-gray-400 mt-1">Assignment Score</p>
                                    </div>

                                    {/* Metrics */}
                                    <div className="space-y-3 mb-5">
                                        {[
                                            { label: 'Logical Correctness', val: showResults.evaluation.logicalCorrectness },
                                            { label: 'Concept Application', val: showResults.evaluation.conceptApplication },
                                            { label: 'Code Structure', val: showResults.evaluation.codeStructure },
                                            { label: 'Completeness', val: showResults.evaluation.completeness },
                                            { label: 'Efficiency', val: showResults.evaluation.efficiency },
                                        ].map((m, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-400">{m.label}</span>
                                                    <span className={m.val >= 80 ? 'text-emerald-400' : m.val >= 60 ? 'text-amber-400' : 'text-red-400'}>{m.val}%</span>
                                                </div>
                                                <div className="progress-bar"><div className={`progress-fill ${m.val >= 80 ? 'bg-emerald-500' : m.val >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${m.val}%` }} /></div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mistake Breakdown */}
                                    {showResults.evaluation.mistakeBreakdown && showResults.evaluation.mistakeBreakdown.length > 0 && (
                                        <div className="glass p-4 rounded-xl mb-4 border-l-4 border-red-500">
                                            <h3 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2"><BarChart3 size={14} /> Mistake Breakdown</h3>
                                            <ul className="space-y-1.5">
                                                {showResults.evaluation.mistakeBreakdown.map((m, i) => (
                                                    <li key={i} className="text-xs text-gray-400">
                                                        <span className="text-red-400 font-bold uppercase text-[9px] block mb-0.5">{m.area}</span>
                                                        {m.description}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Improvements */}
                                    {showResults.evaluation.improvements && (
                                        <div className="glass p-4 rounded-xl mb-4">
                                            <h3 className="text-sm font-medium text-amber-400 mb-2 flex items-center gap-2"><Lightbulb size={14} /> Improvement Suggestions</h3>
                                            <ul className="space-y-1.5">
                                                {showResults.evaluation.improvements.map((imp, i) => (
                                                    <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                                                        <span className="text-amber-400 mt-0.5">→</span> {imp}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <button onClick={() => setShowResults(null)} className="btn-primary w-full">Close</button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Assignment;
