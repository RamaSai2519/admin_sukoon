import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Header from './components/Header/Header';
import AdminLogin from './components/Admin/AdminLogin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard/AdminDashboard';
import UsersList from './components/Admin/UserList/UserList';
import CallList from './components/Admin/CallList/CallList';
import CallDetails from './components/Admin/CallDetails/CallDetails';
import UserDetails from './components/Admin/UserDetails/UserDetails';
import ExpertDetails from './components/Admin/ExpertDetails/ExpertDetatils';
import ExpertReport from './components/Admin/ExpertDetails/ExpertReport';
import ApprovePage from './components/Admin/AdminDashboard/DashboardTabs/Scheduler/ApprovePage';
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

  const appVersion = '7.0.0';
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
    <div className='dark:text-white min-w-screen min-h-screen dark:bg-darkBlack'>
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
