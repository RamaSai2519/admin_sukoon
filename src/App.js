import React, { useState, useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import ExpertDetails from './ExpertDetails/ExpertDetatils';
import { Routes, Route, Navigate } from 'react-router-dom';
import ExpertReport from './ExpertDetails/ExpertReport';
import UserDetails from './UserDetails/UserDetails';
import CallDetails from './CallDetails/CallDetails';
import AdminLogin from './AdminLogin/AdminLogin';
import UserEngagement from './UserEngagement';
import { ConfigProvider, theme } from 'antd';
import UsersList from './UserList/UserList';
import CallList from './CallList/CallList';
import EventDetails from './EventDetails';
import './App.css';

const App = () => {
  const appVersion = '18.0.2';
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );
  const darkMode = useState(() => {
    const localStorageDarkMode = localStorage.getItem('darkMode');
    if (localStorageDarkMode !== null) {
      return JSON.parse(localStorageDarkMode);
    } else {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  });

  const handleLogout = () => {
    setIsLoggedIn(false);
    window.location.reload();
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('appVersion', appVersion);
  };

  useEffect(() => {
    if (darkMode) {
      localStorage.setItem('darkMode', 'true');
      document.body.classList.add('dark');
      document.documentElement.classList.add('dark');
    } else {
      localStorage.setItem('darkMode', 'false');
      document.body.classList.remove('dark');
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const storedVersion = localStorage.getItem('appVersion');
    if (storedVersion !== appVersion) {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem('appVersion', appVersion);
      window.location.reload();
    }
  }, []);

  return (
    <ConfigProvider theme={
      {
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }
    }>
      <div className='dark:text-white min-w-screen min-h-screen overflow-clip dark:bg-darkBlack'>
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Navigate to="/admin/home" />} />
              <Route path="/admin/home/*" element={<AdminDashboard onLogout={handleLogout} />} />
              <Route path="/admin/calls" element={<CallList />} />
              <Route path="/admin/users" element={<UsersList />} />
              <Route path="/admin/calls/:callId" element={<CallDetails />} />
              <Route path="/admin/users/:userId" element={<UserDetails />} />
              <Route path="/admin/events/:slug" element={<EventDetails />} />
              <Route path="/admin/experts/:number" element={<ExpertDetails />} />
              <Route path="/admin/experts/:expertId/report" element={<ExpertReport />} />
              <Route path="/admin/userEngage" element={<UserEngagement />} />
              <Route path="/*" element={<Navigate to="/admin/home" />} />
            </>
          ) : (
            <>
              <Route path="/*" element={<AdminLogin setIsLoggedIn={setIsLoggedIn} />} />
            </>
          )}
        </Routes>
        <SpeedInsights />
      </div>
    </ConfigProvider>
  );
};

export default App;
