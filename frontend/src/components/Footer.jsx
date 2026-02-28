import { Link } from 'react-router-dom';
import { Brain, Github, Linkedin, Twitter, Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative mt-20 border-t border-border bg-white pt-12">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/50 pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-accent-500 to-amber-500 flex items-center justify-center shadow-md shadow-accent-500/20">
                                <Brain size={18} className="text-white" />
                            </div>
                            <span className="text-xl font-display font-bold text-foreground">ACIE</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            AI Career Intelligence Engine — Your smart preparation-to-placement platform powered by AI.
                        </p>
                        <div className="flex gap-3">
                            {[Github, Linkedin, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-accent-500 hover:border-accent-200 transition-all">
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-foreground font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            {[{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }, { name: 'Dashboard', path: '/dashboard' }, { name: 'Resume Analysis', path: '/resume' }].map(link => (
                                <li key={link.path}>
                                    <Link to={link.path} className="text-muted-foreground text-sm hover:text-accent-500 transition-colors">{link.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-foreground font-semibold mb-4">Features</h4>
                        <ul className="space-y-2">
                            {['Adaptive Quiz', 'AI Assignments', 'Resume Intelligence', 'Mastery Tracking'].map(f => (
                                <li key={f} className="text-muted-foreground text-sm">{f}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-foreground font-semibold mb-4">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Mail size={14} className="text-amber-500" /> support@acie.ai
                            </li>
                            <li className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Phone size={14} className="text-amber-500" /> +91 98765 43210
                            </li>
                            <li className="flex items-center gap-2 text-muted-foreground text-sm">
                                <MapPin size={14} className="text-amber-500" /> India
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
                    <p>© 2026 ACIE. All rights reserved.</p>
                    <p className="flex items-center gap-1">Made with <Heart size={12} className="text-red-500" /> by Team ACIE</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
