import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Resume from './pages/Resume';
import Quiz from './pages/Quiz';
import QuizAttempt from './pages/QuizAttempt';
import Assignment from './pages/Assignment';
import CodeChallenge from './pages/CodeChallenge';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import InterviewSelection from './pages/InterviewSelection';
import InterviewSession from './pages/InterviewSession';
import InterviewReport from './pages/InterviewReport';

import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

const pageVariants = {
    initial: { opacity: 0, y: 12 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -12 }
};

const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3
};

const AnimatedPage = ({ children }) => (
    <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="w-full h-full"
    >
        {children}
    </motion.div>
);

const AppContent = () => {
    const location = useLocation();
    const isAuthPage = ['/login', '/signup'].includes(location.pathname);

    return (
        <div className={`min-h-screen bg-background text-foreground flex flex-col ${isAuthPage ? 'h-screen overflow-hidden' : ''}`}>
            <ScrollToTop />
            {!isAuthPage && <Navbar />}
            <main className="flex-1">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
                        <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
                        <Route path="/signup" element={<AnimatedPage><Signup /></AnimatedPage>} />
                        <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />

                        {/* Protected Routes */}
                        <Route path="/resume" element={<ProtectedRoute><AnimatedPage><Resume /></AnimatedPage></ProtectedRoute>} />
                        <Route path="/quiz" element={<ProtectedRoute><AnimatedPage><Quiz /></AnimatedPage></ProtectedRoute>} />
                        <Route path="/quiz/:id" element={<ProtectedRoute><AnimatedPage><QuizAttempt /></AnimatedPage></ProtectedRoute>} />
                        <Route path="/assignments" element={<ProtectedRoute><AnimatedPage><Assignment /></AnimatedPage></ProtectedRoute>} />
                        <Route path="/assignments/:id" element={<ProtectedRoute><AnimatedPage><CodeChallenge /></AnimatedPage></ProtectedRoute>} />
                        <Route path="/dashboard" element={<ProtectedRoute><AnimatedPage><Dashboard /></AnimatedPage></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><AnimatedPage><Profile /></AnimatedPage></ProtectedRoute>} />
                        <Route path="/admin" element={<ProtectedRoute><AnimatedPage><Admin /></AnimatedPage></ProtectedRoute>} />
                        <Route path="/interview/select" element={<ProtectedRoute><AnimatedPage><InterviewSelection /></AnimatedPage></ProtectedRoute>} />
                        <Route path="/interview/:id" element={<ProtectedRoute><AnimatedPage><InterviewSession /></AnimatedPage></ProtectedRoute>} />
                        <Route path="/interview/report/:id" element={<ProtectedRoute><AnimatedPage><InterviewReport /></AnimatedPage></ProtectedRoute>} />
                    </Routes>
                </AnimatePresence>
            </main>
            {!isAuthPage && <Footer />}
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

export default App;
