import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import Header from './components/Header/Header';
import AdminLogin from './components/Admin/AdminLogin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard/AdminDashboard';
import UsersList from './components/Admin/UserList/UserList';
import ExpertsList from './components/Admin/ExpertList/ExpertList';
import CallList from './components/Admin/CallList/CallList';
import CallDetails from './components/Admin/CallDetails/CallDetails';
import UserDetails from './components/Admin/UserDetails/UserDetails';
import ExpertDetails from './components/Admin/ExpertDetails/ExpertDetatils';
import ClearCacheButton from './components/ClearCacheButton';
import './App.css';

const App = () => {
  // Retrieve isLoggedIn from localStorage or default to false
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );
  // Retrieve darkMode from localStorage or default to the device theme
  const [darkMode, setDarkMode] = useState(() => {
    const localStorageDarkMode = localStorage.getItem('darkMode');
    // Check if dark mode is explicitly set in localStorage
    if (localStorageDarkMode !== null) {
      return JSON.parse(localStorageDarkMode);
    } else {
      // Otherwise, use the device theme
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    // Store darkMode in localStorage
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <div className={darkMode ? 'App dark-mode' : 'App'}>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div>
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Navigate to="/calls/dashboard" />} />
              <Route path="/calls" element={<CallList />} />
              <Route path="/users" element={<UsersList />} />
              <Route path="/experts" element={<ExpertsList />} />
              <Route path="/calls/:callId" element={<CallDetails />} />
              <Route path="/users/:userId" element={<UserDetails />} />
              <Route path="/experts/:expertId" element={<ExpertDetails />} />
              <Route path="/calls/dashboard" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/calls/dashboard" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<AdminLogin onLogin={handleLogin} />} />
              <Route path="/calls/*" element={<Navigate to="/" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
      <Analytics />
      <SpeedInsights />
      <ClearCacheButton />
    </div>
  );
};

export default App;