import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Code2, CheckCircle, Circle, Play, ChevronLeft, ChevronRight, Clock, Target, Flame, ArrowUpDown, Loader, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const fadeUp = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { visible: { transition: { staggerChildren: 0.05 } } };

const AssignmentList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    // Filters
    const [search, setSearch] = useState('');
    const [filterDiff, setFilterDiff] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortBy, setSortBy] = useState('id');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/assignments', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setAssignments(data);
            }
        } catch (error) {
            console.error('Failed to fetch assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/assignments/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ topic: 'Data Structures', type: 'coding' })
            });
            const newAssignment = await res.json();
            if (res.ok) {
                setAssignments([newAssignment, ...assignments]);
            }
        } catch (error) {
            console.error('Failed to generate assignment:', error);
        } finally {
            setGenerating(false);
        }
    };

    // Sorting & Filtering Logic
    const getSortedProblems = (problems) => {
        return [...problems].sort((a, b) => {
            if (sortBy === 'difficulty') return b.difficulty - a.difficulty;
            return new Date(b.createdAt) - new Date(a.createdAt); // default newest first
        });
    };

    const filtered = getSortedProblems(assignments).filter(p => {
        const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
        const matchDiff = filterDiff === 'All' ||
            (filterDiff === 'Easy' && p.difficulty <= 2) ||
            (filterDiff === 'Medium' && p.difficulty === 3) ||
            (filterDiff === 'Hard' && p.difficulty > 3);
        const matchStatus = filterStatus === 'All' || p.status === filterStatus;
        return matchSearch && matchDiff && matchStatus;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Presentation Helpers
    const getDiffLabel = (diff) => diff <= 2 ? 'Easy' : diff === 3 ? 'Medium' : 'Hard';
    const getDiffColor = (diff) => {
        if (diff <= 2) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
        if (diff === 3) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
        return 'text-red-500 bg-red-500/10 border-red-500/20';
    };

    const getStatusIcon = (status) => {
        if (status === 'evaluated') return <CheckCircle size={16} className="text-emerald-500" />;
        if (status === 'submitted') return <Clock size={16} className="text-amber-500" />;
        return <Circle size={16} className="text-gray-300" />;
    };

    return (
        <div className="pt-24 pb-12 min-h-screen bg-background">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
                            <div>
                                <h1 className="text-3xl font-display font-bold text-gray-900 mb-1">Practice <span className="text-primary-600">Hub</span></h1>
                                <p className="text-gray-500 text-sm">LeetCode-style algorithmic challenges tailored to your weaknesses.</p>
                            </div>
                            <button
                                onClick={handleGenerate}
                                disabled={generating}
                                className="btn-primary flex items-center gap-2 !py-2 !px-4 text-sm"
                            >
                                {generating ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />}
                                Generate Problem
                            </button>
                        </motion.div>

                        <motion.div variants={fadeUp} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center relative z-10">
                            <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
                                <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 cursor-pointer focus:ring-1 focus:ring-primary-500 outline-none">
                                    <option value="All">Status: All</option>
                                    <option value="evaluated">Solved</option>
                                    <option value="pending">Todo</option>
                                </select>
                                <select value={filterDiff} onChange={(e) => { setFilterDiff(e.target.value); setCurrentPage(1); }} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 cursor-pointer focus:ring-1 focus:ring-primary-500 outline-none">
                                    <option value="All">Difficulty: All</option>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>

                            <div className="relative w-full md:w-64">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by title..."
                                    value={search}
                                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg pl-9 pr-4 py-2 focus:ring-1 focus:ring-primary-500 outline-none"
                                />
                            </div>
                        </motion.div>

                        {/* Problems Table */}
                        <motion.div variants={fadeUp} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="grid grid-cols-12 gap-4 border-b border-gray-100 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <div className="col-span-1 text-center">Sta</div>
                                <div className="col-span-6 flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => setSortBy('id')}>
                                    Title {sortBy === 'id' && <ArrowUpDown size={12} />}
                                </div>
                                <div className="col-span-3 flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => setSortBy('difficulty')}>
                                    Difficulty {sortBy === 'difficulty' && <ArrowUpDown size={12} />}
                                </div>
                                <div className="col-span-2 text-right">Action</div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {loading && <div className="px-4 py-12 text-center flex justify-center"><Loader className="animate-spin text-primary-500" /></div>}

                                {!loading && paginatedData.map((p, i) => (
                                    <div key={p._id} onClick={() => navigate(`/assignments/${p._id}`)} className={`grid grid-cols-12 gap-4 px-4 py-3.5 items-center hover:bg-gray-50 transition-colors cursor-pointer ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <div className="col-span-1 flex justify-center">{getStatusIcon(p.status)}</div>
                                        <div className="col-span-6 font-medium text-gray-900 group flex items-center gap-2 truncate">
                                            <span className="group-hover:text-primary-600 transition-colors truncate">{p.title}</span>
                                        </div>
                                        <div className="col-span-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${getDiffColor(p.difficulty)}`}>
                                                {getDiffLabel(p.difficulty)}
                                            </span>
                                        </div>
                                        <div className="col-span-2 text-right">
                                            <span className="text-primary-600 text-xs font-semibold hover:underline border-b border-transparent">Solve</span>
                                        </div>
                                    </div>
                                ))}

                                {!loading && filtered.length === 0 && (
                                    <div className="px-4 py-16 text-center text-gray-500 flex flex-col items-center gap-3">
                                        <Code2 size={40} className="text-gray-300" />
                                        <p>No algorithms found in your assigned set.</p>
                                        <button onClick={handleGenerate} className="text-primary-600 font-semibold hover:underline">Generate a new one</button>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {filtered.length > 0 && (
                                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                                    <span className="text-xs font-medium text-gray-500">Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filtered.length)} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}</span>
                                    <div className="flex gap-1">
                                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded disabled:opacity-30 disabled:hover:bg-transparent"><ChevronLeft size={16} /></button>
                                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded disabled:opacity-30 disabled:hover:bg-transparent"><ChevronRight size={16} /></button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Right Sidebar Widgets */}
                    <motion.div variants={fadeUp} className="lg:col-span-1 space-y-6">
                        {/* Daily Challenge Mock */}
                        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-4 text-white">
                                <div className="flex items-center gap-2 mb-1">
                                    <Target size={16} className="text-white/80" />
                                    <h3 className="text-sm font-bold uppercase tracking-wider">Algorithmic Push</h3>
                                </div>
                                <p className="text-xs text-white/70">Solve to improve your stats</p>
                            </div>
                            <div className="p-5 text-center">
                                <button onClick={handleGenerate} disabled={generating} className="w-full btn-primary !py-2 !text-sm flex justify-center items-center gap-2">
                                    {generating ? <Loader size={14} className="animate-spin" /> : <Play size={14} />}
                                    Generate New
                                </button>
                            </div>
                        </div>

                        {/* Streak Widget */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-gray-900 font-bold">
                                    <Flame size={18} className="text-orange-500" />
                                    <span>Solving Streak</span>
                                </div>
                                <span className="text-xl font-display font-black text-orange-500">12<span className="text-sm text-gray-400 font-medium ml-1">Days</span></span>
                            </div>
                            <div className="flex justify-between items-center text-center">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <span className="text-[10px] text-gray-400 font-medium">{day}</span>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${i < 5 ? 'bg-orange-100 border-orange-200 text-orange-500' : 'bg-gray-50 border-gray-200 text-transparent'}`}>
                                            {i < 5 && <CheckCircle size={10} />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default AssignmentList;
