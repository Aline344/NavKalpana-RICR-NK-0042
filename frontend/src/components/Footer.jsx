import { Link } from 'react-router-dom';
import { Brain, Github, Linkedin, Twitter, Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative mt-20 border-t border-white/10">
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/10 to-transparent pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
                                <Brain size={18} className="text-white" />
                            </div>
                            <span className="text-xl font-display font-bold gradient-text">ACIE</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            AI Career Intelligence Engine — Your smart preparation-to-placement platform powered by AI.
                        </p>
                        <div className="flex gap-3">
                            {[Github, Linkedin, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-primary-400 hover:border-primary-500/30 transition-all">
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {[{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }, { name: 'Dashboard', path: '/dashboard' }, { name: 'Resume Analysis', path: '/resume' }].map(link => (
                                <li key={link.path}>
                                    <Link to={link.path} className="text-gray-400 text-sm hover:text-primary-400 transition-colors">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div> 
                    <div>
                        <h4 className="text-white font-semibold mb-4">Features</h4>
                        <ul className="space-y-2">
                            {['Adaptive Quiz', 'AI Assignments', 'Resume Intelligence', 'Mastery Tracking'].map(f => (
                                <li key={f} className="text-gray-400 text-sm">{f}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-gray-400 text-sm">
                                <Mail size={14} className="text-primary-400" /> support@acie.ai
                            </li>
                            <li className="flex items-center gap-2 text-gray-400 text-sm">
                                <Phone size={14} className="text-primary-400" /> +91 98765 43210
                            </li>
                            <li className="flex items-center gap-2 text-gray-400 text-sm">
                                <MapPin size={14} className="text-primary-400" /> India
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
                    <p>© 2026 ACIE. All rights reserved.</p>
                    <p className="flex items-center gap-1">Made with <Heart size={12} className="text-red-500" /> by Team ACIE</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
