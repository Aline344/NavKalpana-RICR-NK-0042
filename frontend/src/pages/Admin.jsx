import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Users, Trash2, ShieldCheck, User, Search, BarChart3, FileText, Code2, Brain, Sparkles, Clock, Zap, CalendarDays, CheckCircle, AlertTriangle } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const Admin = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [stats, setStats] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetail, setUserDetail] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => { fetchData(); }, []);
    const fetchData = async () => {
        try {
            const [usersRes, statsRes] = await Promise.all([
                axios.get('/api/dashboard/admin/users'),
                axios.get('/api/dashboard/stats')
            ]);
            setUsers(usersRes.data.users || []);
            setStats(usersRes.data.platformStats || statsRes.data);
        } catch (err) {
            console.error('Admin fetch error:', err);
            setError('Failed to fetch admin data. Please ensure you have admin privileges.');
        }
        setLoading(false);
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axios.put(`/api/dashboard/admin/users/${userId}/role`, { role: newRole });
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        } catch {
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        }
    };

    const viewActivity = async (userId) => {
        setSelectedUser(userId);
        setLoadingDetail(true);
        try {
            const { data } = await axios.get(`/api/dashboard/admin/users/${userId}`);
            setUserDetail(data);
        } catch (err) {
            console.error('Error fetching user details:', err);
            alert('Failed to load user activity details.');
        }
        setLoadingDetail(false);
    };

    const handleDelete = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`/api/dashboard/admin/users/${userId}`);
            setUsers(users.filter(u => u._id !== userId));
        } catch {
            setUsers(users.filter(u => u._id !== userId));
        }
    };

    const filtered = (Array.isArray(users) ? users : []).filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-20">
            <svg className="animate-spin h-10 w-10 text-primary-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4">
            <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400 text-center mb-6">{error}</p>
            <button onClick={() => navigate('/dashboard')} className="btn-primary">Back to Dashboard</button>
        </div>
    );

    return (
        <div className="pt-20 pb-10 min-h-screen">
            <div className="absolute inset-0 bg-hero-gradient -z-10" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div initial="hidden" animate="visible" variants={stagger}>
                    {/* Header */}
                    <motion.div variants={fadeUp} className="mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-4">
                            <Sparkles size={13} className="text-primary-400" />
                            <span className="text-sm text-gray-300">Admin Panel</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-display font-bold gradient-text">Admin Dashboard</h1>
                        <p className="text-gray-400 text-sm mt-1">Platform overview and user management</p>
                    </motion.div>

                    {/* Stats */}
                    {stats && (
                        <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {[
                                { label: 'Total Users', value: stats.totalUsers || users.length, icon: <Users size={20} />, color: 'text-primary-400' },
                                { label: 'Total Quizzes', value: stats.totalQuizzes || 0, icon: <BarChart3 size={20} />, color: 'text-accent-400' },
                                { label: 'Total Assignments', value: stats.totalAssignments || 0, icon: <Code2 size={20} />, color: 'text-cyber-400' },
                                { label: 'Avg Mastery', value: `${stats.avgMastery || 0}%`, icon: <Brain size={20} />, color: 'text-emerald-400' },
                            ].map((s, i) => (
                                <div key={i} className="glass-card">
                                    <div className={`text-2xl ${s.color} mb-2`}>{s.icon}</div>
                                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                                    <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* Search */}
                    <motion.div variants={fadeUp} className="mb-5">
                        <div className="relative max-w-md">
                            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                className="input-field !pl-10" placeholder="Search users by name or email..." />
                        </div>
                    </motion.div>

                    {/* Users Table */}
                    <motion.div variants={fadeUp} className="glass-strong rounded-2xl overflow-hidden">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left p-4 text-xs text-gray-400 font-medium">User</th>
                                        <th className="text-left p-4 text-xs text-gray-400 font-medium">Target Role</th>
                                        <th className="text-left p-4 text-xs text-gray-400 font-medium">Role</th>
                                        <th className="text-left p-4 text-xs text-gray-400 font-medium">Last Active</th>
                                        <th className="text-left p-4 text-xs text-gray-400 font-medium">Top Skills</th>
                                        <th className="text-right p-4 text-xs text-gray-400 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((u, i) => (
                                        <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-white text-sm font-medium">{u.name}</p>
                                                        <p className="text-gray-500 text-xs">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4"><span className="badge-info text-[10px]">{u.targetRole || 'N/A'}</span></td>
                                            <td className="p-4">
                                                <select value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)}
                                                    className="bg-dark-700 text-sm text-white border border-white/10 rounded-lg px-2 py-1 focus:outline-none focus:border-primary-500">
                                                    <option value="student">Student</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td className="p-4 text-xs text-gray-400">{new Date(u.lastActive).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <div className="flex gap-1 flex-wrap">
                                                    {(u.topicMastery || []).slice(0, 2).map((t, j) => (
                                                        <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">
                                                            {t.topic}: {t.score}%
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => viewActivity(u._id)}
                                                        className="p-2 rounded-lg hover:bg-primary-500/20 text-gray-400 hover:text-primary-400 transition-all"
                                                        title="View Activity">
                                                        <BarChart3 size={14} />
                                                    </button>
                                                    <button onClick={() => handleDelete(u._id)}
                                                        className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all"
                                                        title="Delete user">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden p-4 space-y-3">
                            {filtered.map((u) => (
                                <div key={u._id} className="glass p-4 rounded-xl">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                                                {u.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-medium">{u.name}</p>
                                                <p className="text-gray-500 text-xs">{u.email}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(u._id)} className="p-2 text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <span className="badge-info text-[10px]">{u.targetRole || 'N/A'}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-primary-500/20 text-primary-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                            {u.role === 'admin' ? <><ShieldCheck size={11} className="inline mr-1" />Admin</> : <><User size={11} className="inline mr-1" />Student</>}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-1 flex-wrap">
                                            {(u.topicMastery || []).slice(0, 3).map((t, j) => (
                                                <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400">{t.topic}: {t.score}%</span>
                                            ))}
                                        </div>
                                        <button onClick={() => viewActivity(u._id)} className="text-[10px] bg-primary-500/20 text-primary-400 px-3 py-1 rounded-lg font-bold">Details</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filtered.length === 0 && (
                            <div className="p-12 text-center">
                                <Users size={36} className="text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-400">No users found</p>
                            </div>
                        )}
                    </motion.div>

                    {/* User Activity Modal */}
                    <AnimatePresence>
                        {selectedUser && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                                onClick={() => setSelectedUser(null)}>
                                <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                    className="glass-strong p-8 rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-y-auto border border-white/10 shadow-2xl"
                                    onClick={e => e.stopPropagation()}>

                                    {loadingDetail ? (
                                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                                            <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                                            <p className="text-gray-400 animate-pulse font-mono text-sm">Loading A to Z Activity...</p>
                                        </div>
                                    ) : userDetail ? (
                                        <div>
                                            <div className="flex items-start justify-between mb-8">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary-500/20">
                                                        {userDetail.user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-display font-bold text-white">{userDetail.user.name}</h2>
                                                        <p className="text-gray-500 flex items-center gap-2 text-sm"><FileText size={14} /> {userDetail.user.email}</p>
                                                        <div className="flex gap-2 mt-2">
                                                            <span className="badge-info text-[10px] uppercase font-bold tracking-wider">{userDetail.user.targetRole || 'No Target Role'}</span>
                                                            <span className="badge-success text-[10px] uppercase font-bold tracking-wider">ATS Score: {userDetail.user.resumeStrength}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button onClick={() => setSelectedUser(null)} className="text-gray-500 hover:text-white transition-colors p-2 glass rounded-xl">
                                                    <Trash2 size={20} className="rotate-45" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {/* Topic Mastery */}
                                                <div className="glass p-6 rounded-2xl">
                                                    <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-widest flex items-center gap-2 text-primary-400 font-display">
                                                        <Brain size={16} /> Topic Mastery Heatmap
                                                    </h3>
                                                    <div className="space-y-4">
                                                        {userDetail.topicMastery.map((m, i) => (
                                                            <div key={i}>
                                                                <div className="flex justify-between text-xs mb-1.5">
                                                                    <span className="text-gray-300 font-medium">{m.topic}</span>
                                                                    <span className="text-white font-bold">{m.score}%</span>
                                                                </div>
                                                                <div className="h-1.5 glass rounded-full overflow-hidden">
                                                                    <div className={`h-full transition-all duration-1000 ${m.score >= 80 ? 'bg-emerald-500' : m.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                                        style={{ width: `${m.score}%` }} />
                                                                </div>
                                                                <div className="flex justify-between mt-1">
                                                                    <p className="text-[9px] text-gray-500">Quiz: {m.quizAvg}% | Assignment: {m.assignmentAvg}%</p>
                                                                    <p className={`text-[9px] font-bold uppercase ${m.riskLevel === 'low' ? 'text-emerald-400' : 'text-red-400'}`}>{m.riskLevel} Risk</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {userDetail.topicMastery.length === 0 && <p className="text-xs text-gray-600 italic">No mastery data points recorded yet.</p>}
                                                    </div>
                                                </div>

                                                {/* Activity Feed */}
                                                <div className="glass p-6 rounded-2xl">
                                                    <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-widest flex items-center gap-2 text-accent-400 font-display">
                                                        <Clock size={16} /> Recent Academic Activity
                                                    </h3>
                                                    <div className="space-y-3">
                                                        {userDetail.recentActivity.map((a, i) => (
                                                            <div key={i} className="flex items-center justify-between glass p-3 rounded-xl border border-white/5">
                                                                <div className="flex gap-3 items-center">
                                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.type === 'quiz' ? 'bg-accent-500/10 text-accent-400' : 'bg-cyber-500/10 text-cyber-400'}`}>
                                                                        {a.type === 'quiz' ? <Zap size={14} /> : <Code2 size={14} />}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs font-bold text-white">{a.title}</p>
                                                                        <p className="text-[10px] text-gray-500">{new Date(a.date).toLocaleDateString()}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className={`text-xs font-bold ${a.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{a.score}%</p>
                                                                    <p className="text-[9px] text-gray-500 uppercase">{a.type}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {userDetail.recentActivity.length === 0 && <p className="text-xs text-gray-600 italic">No activities completed yet.</p>}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Study Plan Status */}
                                            <div className="mt-8 glass p-6 rounded-2xl">
                                                <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-widest flex items-center gap-2 text-cyber-400 font-display">
                                                    <CalendarDays size={16} /> Personalized Study Plan Status
                                                </h3>
                                                <div className="flex flex-wrap gap-3">
                                                    {userDetail.studyPlan.map((s, i) => (
                                                        <div key={i} className={`px-4 py-2 rounded-xl flex items-center gap-2 border ${s.completed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                                                            {s.completed ? <CheckCircle size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                                                            <span className="text-xs font-medium">{s.topic}</span>
                                                            <span className="text-[9px] uppercase font-bold opacity-50">({s.priority})</span>
                                                        </div>
                                                    ))}
                                                    {userDetail.studyPlan.length === 0 && <p className="text-xs text-gray-600 italic">No study plan tasks generated yet.</p>}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-20 text-center">
                                            <AlertTriangle className="text-red-500 mx-auto mb-4" />
                                            <p className="text-white">Could not load user data.</p>
                                        </div>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Admin;
