import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Stats from './components/Stats';
import Constitution from './components/Constitution';
import Quizer from './components/Quizer';
import Dashboard from './components/Dashboard';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AuthModals from './components/AuthModals';
import HighlightsModal from './components/HighlightsModal';
import AdminPanel from './components/AdminPanel';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  useEffect(() => {
    const user = localStorage.getItem('edulense_user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('edulense_user', JSON.stringify(user));
    setShowLogin(false);
    showNotification('Welcome back!', 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('edulense_user');
    showNotification('Logged out successfully', 'success');
  };

  const showNotification = (message, type = 'info') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: '', type: 'info' }), 3000);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="h-full w-full bg-black text-zinc-100 font-outfit">
        <Navbar
          currentUser={currentUser}
          onLogout={handleLogout}
          onLoginClick={() => setShowLogin(true)}
          onSignupClick={() => setShowSignup(true)}
        />

        <main className="pt-16 min-h-screen">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Features />
                <Stats />
              </>
            } />
            <Route path="/constitution" element={
              <Constitution
                currentUser={currentUser}
                onShowHighlights={() => setShowHighlights(true)}
                showNotification={showNotification}
                onRequestLogin={() => setShowLogin(true)}
              />
            } />
            <Route path="/quizer" element={
              <Quizer currentUser={currentUser} showNotification={showNotification} onRequestLogin={() => setShowLogin(true)} />
            } />
            <Route path="/dashboard" element={
              currentUser ?
                <Dashboard currentUser={currentUser} /> :
                <Navigate to="/" replace />
            } />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact showNotification={showNotification} />} />
            <Route path="/admin" element={
              currentUser?.role === 'admin' ?
                <AdminPanel currentUser={currentUser} showNotification={showNotification} /> :
                <Navigate to="/" replace />
            } />
          </Routes>

        </main>

        <Footer />

        {showLogin && <AuthModals type="login" onClose={() => setShowLogin(false)} onSwitch={() => { setShowLogin(false); setShowSignup(true); }} onSuccess={handleLogin} />}
        {showSignup && <AuthModals type="signup" onClose={() => setShowSignup(false)} onSwitch={() => { setShowSignup(false); setShowLogin(true); }} onSuccess={handleLogin} />}
        {showHighlights && <HighlightsModal currentUser={currentUser} onClose={() => setShowHighlights(false)} showNotification={showNotification} />}

        {/* Toast Notification */}
        {toast.visible && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 fade-in">
            <div className="glass-card px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
              <span className={`font-medium ${toast.type === 'error' ? 'text-red-600' : 'text-slate-700'}`}>
                {toast.message}
              </span>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;

