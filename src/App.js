import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Header from './components/Header/Header';
import AdminLogin from './AdminLogin/AdminLogin'
import AdminDashboard from './AdminDashboard/AdminDashboard';
import UsersList from './UserList/UserList';
import CallList from './CallList/CallList';
import CallDetails from './CallDetails/CallDetails';
import UserDetails from './UserDetails/UserDetails'
import ExpertDetails from './ExpertDetails/ExpertDetatils'
import ExpertReport from './ExpertDetails/ExpertReport'
import ApprovePage from './AdminDashboard/DashboardTabs/Scheduler/ApprovePage'
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );
  const [darkMode, setDarkMode] = useState(() => {
    const localStorageDarkMode = localStorage.getItem('darkMode');
    if (localStorageDarkMode !== null) {
      return JSON.parse(localStorageDarkMode);
    } else {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  });

  const appVersion = '7.3.0';
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  useEffect(() => {
    const storedVersion = localStorage.getItem('appVersion');
    if (storedVersion !== appVersion) {
      window.location.reload();
      clearAllCaches();
      localStorage.setItem('appVersion', appVersion);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      localStorage.setItem('darkMode', 'true');
      document.body.classList.add('dark');
    } else {
      localStorage.setItem('darkMode', 'false');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const clearAllCaches = () => {
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <div className='dark:text-white min-w-screen md:min-h-screen min-h-[210vh] dark:bg-darkBlack'>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div>
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Navigate to="/admin/dashboard" />} />
              <Route path="/admin/calls" element={<CallList />} />
              <Route path="/admin/users" element={<UsersList />} />
              <Route path="/admin/calls/:callId" element={<CallDetails />} />
              <Route path="/admin/users/:userId" element={<UserDetails />} />
              <Route path="/admin/experts/:expertId" element={<ExpertDetails />} />
              <Route path="/admin/experts/:expertId/report" element={<ExpertReport />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/approve/:scheduleId/:level" element={<ApprovePage />} />
              <Route path="/*" element={<Navigate to="/admin/dashboard" />} />
            </>
          ) : (
            <>
              <Route path="/*" element={<AdminLogin onLogin={handleLogin} />} />
              <Route path="/approve/:scheduleId/:level" element={<ApprovePage />} />
            </>
          )}
        </Routes>
      </div>
      <SpeedInsights />
    </div>
  );
};

export default App;
