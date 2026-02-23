import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Clock, Flag, ArrowLeft, ArrowRight, CheckCircle, XCircle, BarChart3, Lightbulb, Sparkles } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const demoQuestions = [
    {
        questionText: 'What is the output of typeof null in JavaScript?',
        type: 'mcq-single',
        options: [
            { text: '"null"', isCorrect: false },
            { text: '"undefined"', isCorrect: false },
            { text: '"object"', isCorrect: true },
            { text: '"boolean"', isCorrect: false }
        ],
        explanation: 'typeof null returns "object" due to a historical bug in JavaScript.',
        conceptTag: 'Type System'
    }
];

const QuizAttempt = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [flagged, setFlagged] = useState(new Set());
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState(null);
    const [showFlagModal, setShowFlagModal] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (id === 'demo') {
            setQuiz({ _id: 'demo', title: 'JavaScript Adaptive Quiz', topic: 'JavaScript', difficulty: 3, questions: demoQuestions, totalQuestions: demoQuestions.length, timeLimit: 16 });
            setTimeLeft(16 * 60);
        } else {
            fetchQuiz();
        }
        return () => clearInterval(timerRef.current);
    }, [id]);

    useEffect(() => {
        if (timeLeft > 0 && !submitted) {
            timerRef.current = setInterval(() => setTimeLeft(t => { if (t <= 1) { handleSubmit(true); return 0; } return t - 1; }), 1000);
            return () => clearInterval(timerRef.current);
        }
    }, [timeLeft, submitted]);

    // Anti-cheat logic
    useEffect(() => {
        if (submitted) return;

        const handleSecurityBreach = () => {
            console.warn('Security breach detected: Automatic submission triggered.');
            handleSubmit(true);
        };

        const preventDefaults = (e) => {
            // Prevent Copy, Paste, PrintScreen, F12
            if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'p' || e.key === 'u')) {
                e.preventDefault();
                return false;
            }
            if (e.key === 'F12' || e.key === 'PrintScreen') {
                e.preventDefault();
                return false;
            }
        };

        const preventRightClick = (e) => e.preventDefault();

        window.addEventListener('blur', handleSecurityBreach);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) handleSecurityBreach();
        });
        document.addEventListener('keydown', preventDefaults);
        document.addEventListener('contextmenu', preventRightClick);

        return () => {
            window.removeEventListener('blur', handleSecurityBreach);
            document.removeEventListener('visibilitychange', handleSecurityBreach);
            document.removeEventListener('keydown', preventDefaults);
            document.removeEventListener('contextmenu', preventRightClick);
        };
    }, [submitted, quiz]);

    const fetchQuiz = async () => {
        try {
            const { data } = await axios.get(`/api/quiz/${id}`);
            setQuiz(data);
            if (data.completedAt) {
                setSubmitted(true);
                setResults({
                    score: data.score,
                    topicAccuracy: data.topicAccuracy,
                    mistakeClassification: data.mistakeClassification,
                    responses: data.responses
                });
            } else {
                setTimeLeft(data.timeLimit * 60);
            }
        } catch (err) {
            console.error('Quiz fetch error:', err);
            // Don't fall back to demo questions, just navigate back if not found
            navigate('/quiz');
        }
    };

    const handleAnswer = (qIndex, answer) => {
        if (submitted) return;
        const q = quiz.questions[qIndex];
        if (q.type === 'mcq-multiple') {
            const prev = answers[qIndex] || [];
            const updated = prev.includes(answer) ? prev.filter(a => a !== answer) : [...prev, answer];
            setAnswers({ ...answers, [qIndex]: updated });
        } else {
            setAnswers({ ...answers, [qIndex]: answer });
        }
    };

    const toggleFlag = () => {
        const next = new Set(flagged);
        if (next.has(currentQ)) next.delete(currentQ);
        else next.add(currentQ);
        setFlagged(next);
    };

    const handleSubmit = async (isForced = false) => {
        if (isForced !== true && flagged.size > 0) {
            setShowFlagModal(true);
            return;
        }
        clearInterval(timerRef.current);
        setSubmitted(true);
        const responses = quiz.questions.map((q, i) => ({
            selectedAnswer: answers[i] ?? '',
            timeTaken: 30,
            flagged: flagged.has(i),
        }));

        try {
            const { data } = await axios.post('/api/quiz/submit', { quizId: quiz._id, responses });
            setResults(data);
        } catch {
            // Calculate results locally for demo
            let correct = 0;
            const conceptStats = {};
            quiz.questions.forEach((q, i) => {
                let isCorrect = false;
                const ans = answers[i];
                if (q.type === 'mcq-single' || q.type === 'scenario') isCorrect = q.options[ans]?.isCorrect;
                else if (q.type === 'mcq-multiple') {
                    const correctIdx = q.options.map((o, idx) => o.isCorrect ? idx : -1).filter(x => x !== -1);
                    isCorrect = Array.isArray(ans) && correctIdx.length === ans.length && correctIdx.every(x => ans.includes(x));
                } else if (q.type === 'short-answer' || q.type === 'code-output') {
                    isCorrect = (ans || '').toLowerCase().includes((q.correctAnswer || '').toLowerCase().substring(0, 10));
                }
                if (isCorrect) correct++;
                const c = q.conceptTag || 'General';
                if (!conceptStats[c]) conceptStats[c] = { correct: 0, total: 0 };
                conceptStats[c].total++;
                if (isCorrect) conceptStats[c].correct++;
            });
            setResults({
                score: Math.round((correct / quiz.questions.length) * 100),
                topicAccuracy: Object.entries(conceptStats).map(([concept, s]) => ({ concept, correct: s.correct, total: s.total, accuracy: Math.round((s.correct / s.total) * 100) })),
                responses: quiz.questions.map((q, i) => ({ questionIndex: i, isCorrect: q.options ? q.options[answers[i]]?.isCorrect : false })),
            });
        }
    };

    const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    if (!quiz) return <div className="min-h-screen flex items-center justify-center pt-20"><svg className="animate-spin h-10 w-10 text-primary-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg></div>;

    const q = quiz.questions[currentQ];

    return (
        <div className="pt-20 pb-10 min-h-screen">
            <div className="absolute inset-0 bg-hero-gradient -z-10" />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {!submitted ? (
                    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                        {/* Header Bar */}
                        <motion.div variants={fadeUp} className="glass-strong p-4 rounded-2xl mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div>
                                <h1 className="text-lg font-semibold text-white">{quiz.title}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="badge-info text-[10px]">{quiz.topic}</span>
                                    <span className="badge-warning text-[10px]">Difficulty {quiz.difficulty}/5</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${timeLeft < 60 ? 'bg-red-500/20 text-red-400' : 'glass text-white'}`}>
                                    <Clock size={14} /> <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                                </div>
                                <span className="text-gray-400 text-sm">{currentQ + 1}/{quiz.questions.length}</span>
                            </div>
                        </motion.div>

                        {/* Question Navigation */}
                        <motion.div variants={fadeUp} className="glass p-3 rounded-xl mb-5 flex flex-wrap gap-2">
                            {quiz.questions.map((_, i) => (
                                <button key={i} onClick={() => setCurrentQ(i)}
                                    className={`w-9 h-9 rounded-lg text-xs font-bold flex items-center justify-center transition-all 
                    ${i === currentQ ? 'bg-primary-500 text-white' : answers[i] !== undefined ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'glass text-gray-400 hover:text-white'}
                    ${flagged.has(i) ? 'ring-2 ring-amber-400' : ''}`}>
                                    {i + 1}
                                </button>
                            ))}
                        </motion.div>

                        {/* Question Card */}
                        <AnimatePresence mode="wait">
                            <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="glass-strong p-6 sm:p-8 rounded-2xl mb-5">
                                <div className="flex items-start justify-between gap-3 mb-5">
                                    <div>
                                        <span className="badge-info text-[10px] mb-2 inline-block">{q.type.replace('-', ' ').toUpperCase()}</span>
                                        <h2 className="text-lg text-white font-medium leading-relaxed">{q.questionText}</h2>
                                    </div>
                                    <button onClick={toggleFlag}
                                        className={`p-2 rounded-lg transition-all ${flagged.has(currentQ) ? 'bg-amber-500/20 text-amber-400' : 'text-gray-500 hover:text-amber-400'}`}>
                                        <Flag size={14} />
                                    </button>
                                </div>

                                {/* Answer Area */}
                                {(q.type === 'mcq-single' || q.type === 'scenario') && (
                                    <div className="space-y-2">
                                        {q.options.map((opt, oi) => (
                                            <button key={oi} onClick={() => handleAnswer(currentQ, oi)}
                                                className={`w-full text-left p-4 rounded-xl border transition-all text-sm ${answers[currentQ] === oi ? 'bg-primary-500/20 border-primary-500/50 text-white' : 'glass border-white/10 text-gray-300 hover:border-white/20 hover:bg-white/5'
                                                    }`}>
                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs mr-3 font-bold">
                                                    {String.fromCharCode(65 + oi)}
                                                </span>
                                                {opt.text}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {q.type === 'mcq-multiple' && (
                                    <div className="space-y-2">
                                        <p className="text-xs text-gray-500 mb-2">Select all that apply</p>
                                        {q.options.map((opt, oi) => (
                                            <button key={oi} onClick={() => handleAnswer(currentQ, oi)}
                                                className={`w-full text-left p-4 rounded-xl border transition-all text-sm ${(answers[currentQ] || []).includes(oi) ? 'bg-primary-500/20 border-primary-500/50 text-white' : 'glass border-white/10 text-gray-300 hover:border-white/20 hover:bg-white/5'
                                                    }`}>
                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded mr-3 text-xs border ${(answers[currentQ] || []).includes(oi) ? 'bg-primary-500 border-primary-500' : 'border-gray-600'}">
                                                    {(answers[currentQ] || []).includes(oi) ? '✓' : ''}
                                                </span>
                                                {opt.text}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {(q.type === 'short-answer' || q.type === 'code-output') && (
                                    <div>
                                        <p className="text-xs text-gray-500 mb-2">{q.type === 'code-output' ? 'Type the expected output' : 'Type your answer'}</p>
                                        <textarea value={answers[currentQ] || ''} onChange={e => handleAnswer(currentQ, e.target.value)}
                                            rows={3} className="input-field resize-none text-sm" placeholder="Type your answer here..." />
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation */}
                        <div className="flex items-center justify-between">
                            <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
                                className="btn-secondary flex items-center gap-2 !py-2.5 disabled:opacity-30">
                                <ArrowLeft size={15} /> Previous
                            </button>
                            {currentQ === quiz.questions.length - 1 ? (
                                <button onClick={handleSubmit} className="btn-primary flex items-center gap-2 !py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400">
                                    <CheckCircle size={15} /> Submit Quiz
                                </button>
                            ) : (
                                <button onClick={() => setCurrentQ(Math.min(quiz.questions.length - 1, currentQ + 1))}
                                    className="btn-primary flex items-center gap-2 !py-2.5">
                                    Next <ArrowRight size={15} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    /* Results View */
                    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                        <motion.div variants={fadeUp} className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-4">
                                <Sparkles size={13} className="text-primary-400" />
                                <span className="text-sm text-gray-300">Quiz Results</span>
                            </div>
                            <h1 className="text-3xl font-display font-bold gradient-text">Quiz Completed!</h1>
                        </motion.div>

                        {results && (
                            <div className="space-y-5">
                                {/* Score Card */}
                                <motion.div variants={fadeUp} className="glass-strong p-8 rounded-2xl text-center">
                                    <div className="relative w-32 h-32 mx-auto mb-4">
                                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                                            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                                            <circle cx="60" cy="60" r="50" fill="none" stroke={results.score >= 80 ? '#10b981' : results.score >= 60 ? '#f59e0b' : '#ef4444'} strokeWidth="10" strokeLinecap="round"
                                                strokeDasharray={`${results.score * 3.14} 314`} />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className={`text-4xl font-bold ${results.score >= 80 ? 'text-emerald-400' : results.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{results.score}%</span>
                                        </div>
                                    </div>
                                    <p className="text-white text-lg font-semibold">{results.score >= 80 ? 'Excellent!' : results.score >= 60 ? 'Good Job!' : 'Keep Practicing!'}</p>
                                </motion.div>

                                {/* Topic Accuracy */}
                                {results.topicAccuracy && (
                                    <motion.div variants={fadeUp} className="glass-strong p-6 rounded-2xl">
                                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><BarChart3 size={16} className="text-primary-400" /> Topic-wise Accuracy</h3>
                                        <div className="space-y-3">
                                            {results.topicAccuracy.map((t, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-gray-400">{t.concept}</span>
                                                        <span className={t.accuracy >= 80 ? 'text-emerald-400' : t.accuracy >= 60 ? 'text-amber-400' : 'text-red-400'}>{t.correct}/{t.total} ({t.accuracy}%)</span>
                                                    </div>
                                                    <div className="progress-bar">
                                                        <div className={`progress-fill ${t.accuracy >= 80 ? 'bg-emerald-500' : t.accuracy >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${t.accuracy}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Mistake Classification */}
                                {results.mistakeClassification && results.mistakeClassification.length > 0 && (
                                    <motion.div variants={fadeUp} className="glass-strong p-6 rounded-2xl">
                                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Lightbulb size={16} className="text-amber-400" /> Mistake Classification</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {results.mistakeClassification.map((m, i) => (
                                                <div key={i} className="glass p-3 rounded-xl text-center border border-white/5">
                                                    <p className="text-lg font-bold text-white">{m.count}</p>
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{m.type}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* Questions Review */}
                                <motion.div variants={fadeUp} className="glass-strong p-6 rounded-2xl">
                                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Lightbulb size={16} className="text-amber-400" /> Detailed Review</h3>
                                    <div className="space-y-4">
                                        {quiz.questions.map((q, i) => {
                                            const resp = results.responses?.[i];
                                            return (
                                                <div key={i} className={`glass p-4 rounded-xl border-l-4 ${resp?.isCorrect ? 'border-emerald-500' : 'border-red-500'}`}>
                                                    <div className="flex items-start gap-2 mb-2">
                                                        {resp?.isCorrect ? <CheckCircle size={14} className="text-emerald-400 mt-1 flex-shrink-0" /> : <XCircle size={14} className="text-red-400 mt-1 flex-shrink-0" />}
                                                        <p className="text-sm text-white">{q.questionText}</p>
                                                    </div>
                                                    {q.explanation && <p className="text-xs text-gray-400 ml-6 mt-1 italic">{q.explanation}</p>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>

                                <motion.div variants={fadeUp} className="flex gap-3 justify-center">
                                    <button onClick={() => navigate('/quiz')} className="btn-secondary">Back to Quizzes</button>
                                    <button onClick={() => navigate('/dashboard')} className="btn-primary">View Dashboard</button>
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Flagged Warning Modal */}
            <AnimatePresence>
                {showFlagModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-strong p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl border border-white/10">
                            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
                                <Flag size={30} className="text-amber-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Review Flagged Questions</h3>
                            <p className="text-gray-400 text-sm mb-6">
                                You have <span className="text-amber-400 font-bold">{flagged.size}</span> question(s) flagged for review.
                                Please check them and unflag to proceed with submission.
                            </p>
                            <button onClick={() => setShowFlagModal(false)}
                                className="btn-primary w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-lg shadow-amber-500/20 transition-all font-bold">
                                Got it, let me check
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default QuizAttempt;
