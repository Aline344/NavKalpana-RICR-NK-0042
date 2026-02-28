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
        { name: 'Home', path: '/', icon: <LayoutDashboard size={14} className="text-gray-500 group-hover:text-accent-500" /> },
        { name: 'About', path: '/about', icon: <Brain size={14} className="text-gray-500 group-hover:text-accent-500" /> },
    ];

    const featureLinks = [
        { name: 'Resume', path: '/resume', icon: <FileText size={14} className="text-gray-500 group-hover:text-accent-500" /> },
        { name: 'Interview Prep', path: '/interview/select', icon: <Briefcase size={14} className="text-gray-500 group-hover:text-amber-500" /> },
        { name: 'Quiz', path: '/quiz', icon: <Zap size={14} className="text-gray-500 group-hover:text-amber-500" /> },
        { name: 'Assignments', path: '/assignments', icon: <Code2 size={14} className="text-gray-500 group-hover:text-emerald-500" /> },
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
        <nav className="fixed top-0 left-0 right-0 z-[9999] bg-white/80 backdrop-blur-2xl border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-accent-500 to-amber-500 flex items-center justify-center shadow-md shadow-accent-500/20 group-hover:shadow-accent-500/40 transition-all duration-300">
                            <Brain size={18} className="text-white" />
                        </div>
                        <span className="text-xl font-display font-bold text-foreground tracking-tight">ACIE</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        {allLinks.map(link => (
                            <Link key={link.path} to={link.path}
                                className={`group px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${isActive(link.path)
                                    ? 'bg-accent-50 text-accent-700 shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-gray-100'
                                    }`}>
                                {link.icon && <span className={`${isActive(link.path) ? 'text-accent-500' : ''}`}>{link.icon}</span>}
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
                                    className="flex items-center gap-2.5 pl-2.5 pr-2 py-1.5 bg-white border border-gray-200 shadow-sm rounded-2xl hover:bg-gray-50 transition-all group"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-accent-500 to-amber-500 flex items-center justify-center text-sm font-bold text-white shadow-md shadow-accent-500/20">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-left hidden xl:block">
                                        <p className="text-[11px] text-foreground font-bold leading-none">{user.name}</p>
                                        <p className="text-[9px] text-muted-foreground leading-none mt-1 uppercase tracking-tighter">{user.role}</p>
                                    </div>
                                    <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {profileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-56 bg-white shadow-card-hover rounded-2xl border border-gray-100 p-2 z-[10000]"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <Link to="/profile" onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all group">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-accent-50 group-hover:text-accent-600 transition-all">
                                                        <User size={14} />
                                                    </div>
                                                    Profile Settings
                                                </Link>
                                                {user?.role !== 'admin' && (
                                                    <Link to="/dashboard" onClick={() => setProfileOpen(false)}
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all group">
                                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-amber-50 group-hover:text-amber-600 transition-all">
                                                            <LayoutDashboard size={14} />
                                                        </div>
                                                        Dashboard
                                                    </Link>
                                                )}
                                                {user?.role === 'admin' && (
                                                    <Link to="/admin" onClick={() => setProfileOpen(false)}
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all group">
                                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-amber-50 group-hover:text-amber-600 transition-all">
                                                            <ShieldCheck size={14} />
                                                        </div>
                                                        Admin Panel
                                                    </Link>
                                                )}
                                                <div className="h-px bg-gray-100 my-1 mx-2" />
                                                <button onClick={handleLogout}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all group">
                                                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-all">
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
                                    className="px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-gray-100 border border-gray-200 rounded-xl transition-all shadow-sm hover:shadow">
                                    Login
                                </Link>
                                <Link to="/signup"
                                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-accent-500 to-amber-500 hover:from-accent-600 hover:to-amber-600 rounded-xl transition-all shadow-md active:scale-95">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden text-muted-foreground hover:text-foreground p-2 rounded-xl hover:bg-gray-100 transition-all">
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
                        className="lg:hidden bg-white/95 backdrop-blur-2xl border-t border-gray-200 overflow-hidden shadow-lg">
                        <div className="px-4 py-4 space-y-1">
                            {allLinks.map(link => (
                                <Link key={link.path} to={link.path}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(link.path)
                                        ? 'bg-accent-50 text-accent-700 shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-gray-50'
                                        }`}>
                                    {link.icon && <span className={`w-4 flex items-center ${isActive(link.path) ? 'text-accent-500' : ''}`}>{link.icon}</span>}
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-3 mt-1 border-t border-gray-100 space-y-2">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-500 to-amber-500 flex items-center justify-center text-sm font-bold text-white shadow-md">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm text-foreground font-bold">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <Link to="/profile" onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive('/profile') ? 'bg-accent-50 text-accent-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                                            <User size={16} /> Profile Settings
                                        </Link>
                                        {user?.role !== 'admin' && (
                                            <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive('/dashboard') ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                                                <LayoutDashboard size={16} /> Dashboard
                                            </Link>
                                        )}
                                        {user?.role === 'admin' && (
                                            <Link to="/admin" onClick={() => setMobileOpen(false)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive('/admin') ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                                                <ShieldCheck size={16} /> Admin Panel
                                            </Link>
                                        )}
                                        <button onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3 px-2">
                                        <Link to="/login" onClick={() => setMobileOpen(false)}
                                            className="block text-center px-4 py-2.5 text-sm font-semibold text-foreground border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
                                            Login
                                        </Link>
                                        <Link to="/signup" onClick={() => setMobileOpen(false)}
                                            className="block text-center px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-accent-500 to-amber-500 rounded-xl transition-all shadow-md">
                                            Sign Up
                                        </Link>
                                    </div>
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
