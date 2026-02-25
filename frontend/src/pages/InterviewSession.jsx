import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
    Clock, ArrowLeft, ArrowRight, CheckCircle,
    MessageSquare, Sparkles, Brain, Zap, Send
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const InterviewSession = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const { data } = await axios.get(`/api/interview/${id}`);
                if (data.status === 'completed') {
                    navigate(`/interview/report/${id}`);
                    return;
                }
                setSession(data);
                // Set fixed time for interview - 15 mins for 5 questions
                setTimeLeft(15 * 60);
                setLoading(false);
            } catch (err) {
                console.error('Fetch session error:', err);
                navigate('/interview/select');
            }
        };
        fetchSession();
        return () => clearInterval(timerRef.current);
    }, [id, navigate]);

    useEffect(() => {
        if (timeLeft > 0 && !submitting) {
            timerRef.current = setInterval(() => {
                setTimeLeft(t => {
                    if (t <= 1) {
                        handleSubmit();
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
            return () => clearInterval(timerRef.current);
        }
    }, [timeLeft, submitting]);

    const handleAnswer = (text) => {
        const questionId = session.questions[currentQ]._id;
        setAnswers({ ...answers, [questionId]: text });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        clearInterval(timerRef.current);
        try {
            await axios.post('/api/interview/submit', {
                sessionId: id,
                answers
            });
            navigate(`/interview/report/${id}`);
        } catch (error) {
            console.error('Submission failed:', error);
            alert('Failed to submit interview. Please try again.');
            setSubmitting(false);
        }
    };

    const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center pt-20">
            <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-4" />
            <p className="text-gray-400 font-medium">Initializing Interview Session...</p>
        </div>
    );

    const q = session.questions[currentQ];
    const progress = ((currentQ + 1) / session.questions.length) * 100;

    return (
        <div className="pt-28 pb-10 min-h-screen px-4 relative">
            <div className="absolute top-0 left-0 w-full h-full bg-hero-gradient -z-10 opacity-40" />

            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                >
                    {/* Header Bar */}
                    <motion.div variants={fadeUp} className="glass border border-white/10 p-5 rounded-3xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary-500/20 flex items-center justify-center text-primary-400 border border-primary-500/20">
                                <Brain size={24} />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white leading-tight">{session.role}</h1>
                                <p className="text-xs text-gray-500 font-medium mt-0.5">{session.category} • {session.difficulty}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5">
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${timeLeft < 120 ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-white/5 border-white/10 text-white'}`}>
                                <Clock size={16} className={timeLeft < 120 ? 'animate-pulse' : ''} />
                                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Progress</p>
                                <p className="text-sm font-bold text-white">{currentQ + 1} / {session.questions.length}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-white/5 rounded-full mb-8 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                        />
                    </div>

                    {/* Question Card */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQ}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="glass border border-white/10 p-8 sm:p-10 rounded-3xl mb-8 relative"
                        >
                            <div className="flex items-center gap-2 mb-6 text-primary-400">
                                <MessageSquare size={18} />
                                <span className="text-xs font-bold uppercase tracking-[0.2em]">Question {currentQ + 1}</span>
                            </div>

                            <h2 className="text-xl sm:text-2xl text-white font-bold leading-relaxed mb-10">
                                {q.questionText}
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-sm font-medium text-gray-400">Your Answer</label>
                                    <span className="text-[10px] text-gray-500 font-mono">
                                        {(answers[q._id] || '').length} characters
                                    </span>
                                </div>
                                <textarea
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500/50 transition-all min-h-[250px] resize-none leading-relaxed"
                                    placeholder="Type your detailed answer here... Technical accuracy and logical structure are evaluated."
                                    value={answers[q._id] || ''}
                                    onChange={(e) => handleAnswer(e.target.value)}
                                />
                            </div>

                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-bl-[100px] pointer-events-none" />
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                            disabled={currentQ === 0 || submitting}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${currentQ === 0 || submitting
                                    ? 'text-gray-600 cursor-not-allowed'
                                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <ArrowLeft size={18} /> Previous Question
                        </button>

                        {currentQ === session.questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white shadow-xl transition-all ${submitting
                                        ? 'bg-gray-700 cursor-not-allowed opacity-50'
                                        : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:shadow-emerald-500/20 active:scale-[0.98]'
                                    }`}
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Submitting Interview...
                                    </>
                                ) : (
                                    <>
                                        Complete & Evaluate
                                        <Send size={18} />
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentQ(Math.min(session.questions.length - 1, currentQ + 1))}
                                disabled={submitting}
                                className="flex items-center gap-2 bg-white/5 px-8 py-4 rounded-2xl font-bold text-white border border-white/10 hover:bg-white/10 transition-all active:scale-[0.98]"
                            >
                                Next Question <ArrowRight size={18} />
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default InterviewSession;
