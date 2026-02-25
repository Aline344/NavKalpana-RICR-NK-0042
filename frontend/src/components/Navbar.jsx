import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Brain, TrendingUp, FileText, Zap, Code2, LayoutDashboard, ShieldCheck, LogOut, User, ChevronDown, Briefcase } from 'lucide-react';

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const publicLinks = [
        { name: 'Home', path: '/', icon: <LayoutDashboard size={14} className="text-primary-400" /> },
        { name: 'About', path: '/about', icon: <Brain size={14} className="text-accent-400" /> },
    ];

    const featureLinks = [
        { name: 'Resume', path: '/resume', icon: <FileText size={14} className="text-cyber-400" /> },
        { name: 'Interview Prep', path: '/interview/select', icon: <Briefcase size={14} className="text-primary-400" /> },
        { name: 'Quiz', path: '/quiz', icon: <Zap size={14} className="text-accent-400" /> },
        { name: 'Assignments', path: '/assignments', icon: <Code2 size={14} className="text-emerald-400" /> },
    ];

    const allLinks = [...publicLinks, ...featureLinks];
    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        logout();
        setMobileOpen(false);
        setProfileOpen(false);
        navigate('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-[9999] bg-dark-950/95 backdrop-blur-2xl border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-300">
                            <Brain size={18} className="text-white" />
                        </div>
                        <span className="text-xl font-display font-bold gradient-text tracking-tight">ACIE</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-0.5">
                        {allLinks.map(link => (
                            <Link key={link.path} to={link.path}
                                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${isActive(link.path)
                                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}>
                                {link.icon && <span>{link.icon}</span>}
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Area */}
                    <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2.5 pl-2.5 pr-2 py-1.5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-primary-500/20">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-left hidden xl:block">
                                        <p className="text-[11px] text-white font-bold leading-none">{user.name}</p>
                                        <p className="text-[9px] text-gray-500 leading-none mt-1 uppercase tracking-tighter">{user.role}</p>
                                    </div>
                                    <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-56 bg-dark-900 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl border border-white/10 p-2 z-[10000]"
                                            style={{ background: '#0a0a14' }}
                                        >
                                            <div className="flex flex-col gap-1">
                                                <Link to="/profile" onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all group">
                                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary-500/20 group-hover:text-primary-400 transition-all">
                                                        <User size={14} />
                                                    </div>
                                                    Profile Settings
                                                </Link>
                                                {user?.role !== 'admin' && (
                                                    <Link to="/dashboard" onClick={() => setProfileOpen(false)}
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all group">
                                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-accent-500/20 group-hover:text-accent-400 transition-all">
                                                            <LayoutDashboard size={14} />
                                                        </div>
                                                        Dashboard
                                                    </Link>
                                                )}
                                                {user?.role === 'admin' && (
                                                    <Link to="/admin" onClick={() => setProfileOpen(false)}
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all group">
                                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-amber-500/20 group-hover:text-amber-400 transition-all">
                                                            <ShieldCheck size={14} />
                                                        </div>
                                                        Admin Panel
                                                    </Link>
                                                )}
                                                <div className="h-px bg-white/5 my-1 mx-2" />
                                                <button onClick={handleLogout}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all group">
                                                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                                                        <LogOut size={14} />
                                                    </div>
                                                    Sign Out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login"
                                    className="px-4 py-2 text-sm text-gray-300 hover:text-white border border-white/[0.15] hover:border-white/30 rounded-lg transition-all hover:bg-white/5">
                                    Login
                                </Link>
                                <Link to="/signup"
                                    className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 rounded-lg transition-all shadow-md shadow-primary-500/20 hover:shadow-primary-500/40">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all">
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden bg-dark-950/95 backdrop-blur-2xl border-t border-white/10 overflow-hidden">
                        <div className="px-4 py-4 space-y-1">
                            {allLinks.map(link => (
                                <Link key={link.path} to={link.path}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(link.path)
                                        ? 'bg-primary-500/20 text-primary-300 border border-primary-500/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}>
                                    {link.icon && <span className="w-4 flex items-center">{link.icon}</span>}
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-3 mt-1 border-t border-white/10 space-y-2">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-sm font-bold">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm text-white font-medium">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <Link to="/profile" onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive('/profile') ? 'bg-primary-500/20 text-primary-300' : 'text-gray-400 hover:text-white'}`}>
                                            <User size={14} /> Profile Settings
                                        </Link>
                                        {user?.role !== 'admin' && (
                                            <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive('/dashboard') ? 'bg-primary-500/20 text-primary-300' : 'text-gray-400 hover:text-white'}`}>
                                                <LayoutDashboard size={14} /> Dashboard
                                            </Link>
                                        )}
                                        {user?.role === 'admin' && (
                                            <Link to="/admin" onClick={() => setMobileOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive('/admin') ? 'bg-amber-500/20 text-amber-300' : 'text-gray-400 hover:text-white'}`}>
                                                <ShieldCheck size={14} className="text-amber-400" /> Admin Panel
                                            </Link>
                                        )}
                                        <button onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                                            <LogOut size={14} /> Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setMobileOpen(false)}
                                            className="block text-center px-4 py-3 text-sm text-gray-300 border border-white/[0.15] rounded-xl hover:bg-white/5 transition-all">
                                            Login
                                        </Link>
                                        <Link to="/signup" onClick={() => setMobileOpen(false)}
                                            className="block text-center px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl transition-all">
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
