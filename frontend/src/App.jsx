import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import InterviewSelection from './pages/InterviewSelection';
import InterviewSession from './pages/InterviewSession';
import InterviewReport from './pages/InterviewReport';

import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

const AppContent = () => {
    const location = useLocation();
    const isAuthPage = ['/login', '/signup'].includes(location.pathname);

    return (
        <div className={`min-h-screen bg-dark-950 flex flex-col ${isAuthPage ? 'h-screen overflow-hidden' : ''}`}>
            <ScrollToTop />
            {!isAuthPage && <Navbar />}
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/about" element={<About />} />

                    {/* Protected Routes */}
                    <Route path="/resume" element={<ProtectedRoute><Resume /></ProtectedRoute>} />
                    <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
                    <Route path="/quiz/:id" element={<ProtectedRoute><QuizAttempt /></ProtectedRoute>} />
                    <Route path="/assignments" element={<ProtectedRoute><Assignment /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                    <Route path="/interview/select" element={<ProtectedRoute><InterviewSelection /></ProtectedRoute>} />
                    <Route path="/interview/:id" element={<ProtectedRoute><InterviewSession /></ProtectedRoute>} />
                    <Route path="/interview/report/:id" element={<ProtectedRoute><InterviewReport /></ProtectedRoute>} />
                </Routes>
            </main>
            {!isAuthPage && <Footer />}
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

export default App;
