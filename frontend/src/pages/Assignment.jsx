import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Code2, CheckCircle, Circle, Play, ChevronLeft, ChevronRight, Clock, Target, Flame, ArrowUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { visible: { transition: { staggerChildren: 0.05 } } };

const mockProblems = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', acceptance: '52.3%', tags: ['Array', 'Hash Table'], status: 'solved', type: 'coding' },
    { id: 2, title: 'Reverse Linked List', difficulty: 'Easy', acceptance: '75.1%', tags: ['Linked List', 'Recursion'], status: 'todo', type: 'coding' },
    { id: 3, title: 'Implement JWT Auth', difficulty: 'Medium', acceptance: '41.2%', tags: ['Security', 'Node.js'], status: 'todo', type: 'mini-project' },
    { id: 4, title: 'Optimize React Renders', difficulty: 'Hard', acceptance: '28.5%', tags: ['React', 'Performance'], status: 'attempted', type: 'debugging' },
    { id: 5, title: 'Design URL Shortener', difficulty: 'Medium', acceptance: '35.9%', tags: ['System Design'], status: 'todo', type: 'system-design' },
    { id: 6, title: 'Binary Tree Level Order', difficulty: 'Medium', acceptance: '65.2%', tags: ['Tree', 'BFS'], status: 'todo', type: 'coding' },
    { id: 7, title: 'Merge K Sorted Lists', difficulty: 'Hard', acceptance: '51.4%', tags: ['Heap', 'Divide & Conquer'], status: 'solved', type: 'coding' },
    { id: 8, title: 'Build Chat Application', difficulty: 'Hard', acceptance: '15.2%', tags: ['WebSockets', 'React'], status: 'todo', type: 'mini-project' },
    { id: 9, title: 'Valid Parentheses', difficulty: 'Easy', acceptance: '40.2%', tags: ['String', 'Stack'], status: 'todo', type: 'coding' },
    { id: 10, title: 'Longest Substring', difficulty: 'Medium', acceptance: '34.5%', tags: ['Hash Table', 'Sliding Window'], status: 'todo', type: 'coding' },
    { id: 11, title: 'Regular Expression', difficulty: 'Hard', acceptance: '28.4%', tags: ['String', 'DP'], status: 'todo', type: 'coding' },
    { id: 12, title: 'Container With Most Water', difficulty: 'Medium', acceptance: '54.5%', tags: ['Array', 'Two Pointers'], status: 'solved', type: 'coding' },
];

const Practice = () => {
    const [search, setSearch] = useState('');
    const [filterDiff, setFilterDiff] = useState('All');
    const [filterTag, setFilterTag] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortBy, setSortBy] = useState('id'); // 'id', 'acceptance', 'difficulty'
    const [currentPage, setCurrentPage] = useState(1);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const itemsPerPage = 10;

    const allTags = [...new Set(mockProblems.flatMap(p => p.tags))];

    // Sorting Logic
    const getSortedProblems = (problems) => {
        return [...problems].sort((a, b) => {
            if (sortBy === 'acceptance') {
                return parseFloat(b.acceptance) - parseFloat(a.acceptance);
            }
            if (sortBy === 'difficulty') {
                const order = { 'Hard': 3, 'Medium': 2, 'Easy': 1 };
                return order[b.difficulty] - order[a.difficulty];
            }
            return a.id - b.id; // default
        });
    };

    // Filtering Logic
    const filtered = getSortedProblems(mockProblems).filter(p => {
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchDiff = filterDiff === 'All' || p.difficulty === filterDiff;
        const matchTag = filterTag === 'All' || p.tags.includes(filterTag);
        const matchStatus = filterStatus === 'All' || p.status === filterStatus;
        return matchSearch && matchDiff && matchTag && matchStatus;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Color/Icon Helpers
    const getDiffColor = (diff) => {
        switch (diff) {
            case 'Easy': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'Medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            case 'Hard': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
        }
    };

    const getStatusIcon = (status) => {
        if (status === 'solved') return <CheckCircle size={16} className="text-emerald-500" />;
        if (status === 'attempted') return <Clock size={16} className="text-amber-500" />;
        return <Circle size={16} className="text-gray-300" />;
    };

    const handleOpenProblem = (problem) => {
        setSelectedProblem(problem);
        setShowDetail(true);
    };

    return (
        <div className="pt-24 pb-12 min-h-screen bg-gray-50">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

                <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

                    {/* Main Content (3 Columns) */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Header & Tabs */}
                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
                            <div>
                                <h1 className="text-3xl font-display font-bold text-gray-900 mb-1">Practice <span className="text-primary-600">Hub</span></h1>
                                <p className="text-gray-500 text-sm">Curated challenges to master technical concepts.</p>
                            </div>
                        </motion.div>

                        {/* Top Control Bar */}
                        <motion.div variants={fadeUp} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center relative z-10">

                            {/* Filter Chips */}
                            <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
                                <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 cursor-pointer focus:ring-1 focus:ring-primary-500 outline-none">
                                    <option value="All">Status: All</option>
                                    <option value="solved">Solved</option>
                                    <option value="todo">Todo</option>
                                    <option value="attempted">Attempted</option>
                                </select>
                                <select value={filterDiff} onChange={(e) => { setFilterDiff(e.target.value); setCurrentPage(1); }} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 cursor-pointer focus:ring-1 focus:ring-primary-500 outline-none">
                                    <option value="All">Difficulty: All</option>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                                <select value={filterTag} onChange={(e) => { setFilterTag(e.target.value); setCurrentPage(1); }} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 cursor-pointer focus:ring-1 focus:ring-primary-500 outline-none max-w-[150px]">
                                    <option value="All">Tags: All</option>
                                    {allTags.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            {/* Search & Sort */}
                            <div className="flex gap-2 w-full md:w-auto">
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
                            </div>
                        </motion.div>

                        {/* Problems Table */}
                        <motion.div variants={fadeUp} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm relative z-0">
                            {/* Table Header with Sort */}
                            <div className="grid grid-cols-12 gap-4 border-b border-gray-100 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <div className="col-span-1 text-center">Sta</div>
                                <div className="col-span-5 flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => setSortBy('id')}>
                                    Title {sortBy === 'id' && <ArrowUpDown size={12} />}
                                </div>
                                <div className="col-span-2 hidden sm:flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => setSortBy('acceptance')}>
                                    Acceptance {sortBy === 'acceptance' && <ArrowUpDown size={12} />}
                                </div>
                                <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-gray-700" onClick={() => setSortBy('difficulty')}>
                                    Difficulty {sortBy === 'difficulty' && <ArrowUpDown size={12} />}
                                </div>
                                <div className="col-span-2 hidden md:block">Tags</div>
                            </div>

                            {/* Table Body */}
                            <div className="divide-y divide-gray-100">
                                {paginatedData.map((p, i) => (
                                    <div key={p.id} onClick={() => handleOpenProblem(p)} className={`grid grid-cols-12 gap-4 px-4 py-3.5 items-center hover:bg-gray-50 transition-colors cursor-pointer ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <div className="col-span-1 flex justify-center">{getStatusIcon(p.status)}</div>
                                        <div className="col-span-5 font-medium text-gray-900 group flex items-center gap-2 truncate">
                                            <span className="text-gray-400 text-xs w-5 text-right font-mono">{p.id}.</span>
                                            <span className="group-hover:text-primary-600 transition-colors truncate">{p.title}</span>
                                        </div>
                                        <div className="col-span-2 hidden sm:block text-sm text-gray-500 font-mono">{p.acceptance}</div>
                                        <div className="col-span-2">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${getDiffColor(p.difficulty)}`}>
                                                {p.difficulty}
                                            </span>
                                        </div>
                                        <div className="col-span-2 hidden md:flex flex-wrap gap-1">
                                            {p.tags.slice(0, 2).map(t => (
                                                <span key={t} className="text-[10px] bg-gray-100 text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded-md truncate max-w-[80px]">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {filtered.length === 0 && (
                                    <div className="px-4 py-12 text-center text-gray-500">
                                        No problems match your current filters.
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

                        {/* Daily Challenge */}
                        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                            <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-4 text-white p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Target size={16} className="text-white/80" />
                                    <h3 className="text-sm font-bold uppercase tracking-wider">Problem of the Day</h3>
                                </div>
                                <p className="text-xs text-white/70">April 14, 2026</p>
                            </div>
                            <div className="p-5">
                                <h4 className="font-bold text-gray-900 mb-2">Merge Intervals</h4>
                                <div className="flex gap-2 mb-4">
                                    <span className="text-xs px-2 py-0.5 rounded border text-amber-500 bg-amber-50 border-amber-200 font-semibold">Medium</span>
                                    <span className="text-xs px-2 py-0.5 rounded border text-gray-500 bg-gray-50 border-gray-200">Array</span>
                                </div>
                                <button className="w-full btn-primary !py-2 !text-sm flex justify-center items-center gap-2">Solve Now <Play size={14} /></button>
                            </div>
                        </div>

                        {/* Streak Widget */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-gray-900 font-bold">
                                    <Flame size={18} className="text-orange-500" />
                                    <span>Current Streak</span>
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

                        {/* Session Stats */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Session Progress</h3>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-500">Easy Solved</span>
                                        <span className="font-bold text-emerald-500">24 <span className="text-gray-400 font-normal">/ 50</span></span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[48%] rounded-full" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-500">Medium Solved</span>
                                        <span className="font-bold text-amber-500">12 <span className="text-gray-400 font-normal">/ 40</span></span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 w-[30%] rounded-full" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-500">Hard Solved</span>
                                        <span className="font-bold text-red-500">3 <span className="text-gray-400 font-normal">/ 20</span></span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500 w-[15%] rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </motion.div>
                </motion.div>
            </div>

            {/* Problem Details Drawer/Split Placeholder */}
            {showDetail && selectedProblem && (
                <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white border-l border-gray-200 shadow-2xl z-50 transform transition-transform overflow-y-auto">
                    <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50 sticky top-0">
                        <h2 className="font-bold text-gray-900">{selectedProblem.id}. {selectedProblem.title}</h2>
                        <button onClick={() => setShowDetail(false)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors"><ChevronRight size={18} /></button>
                    </div>
                    <div className="p-6">
                        <div className="flex gap-2 mb-6">
                            <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold border ${getDiffColor(selectedProblem.difficulty)}`}>{selectedProblem.difficulty}</span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer">Acceptance: {selectedProblem.acceptance}</span>
                        </div>

                        <div className="prose prose-sm max-w-none text-gray-700">
                            <p>This is a placeholder description for the problem. To complete the refactoring, this space would load the problem constraints, examples, and the code editor layout.</p>
                            <h4>Examples:</h4>
                            <pre className="bg-gray-100 p-3 rounded-lg border border-gray-200 text-xs"><code>Input: nums = [2,7,11,15], target = 9{'\n'}Output: [0,1]</code></pre>

                            <div className="mt-8 flex gap-3">
                                <Link to={`/practice/${selectedProblem.id}`} className="btn-primary w-full text-center py-3">Open in Editor</Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Backdrop for drawer */}
            {showDetail && (
                <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 transition-opacity md:hidden" onClick={() => setShowDetail(false)} />
            )}

        </div>
    );
};

export default Practice;
