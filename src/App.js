import React, { useState, useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import ExpertDetails from './ExpertDetails/ExpertDetatils';
import { Routes, Route, Navigate } from 'react-router-dom';
import GenerateImage from './components/GenerateImage';
import { useDarkMode } from './contexts/useDarkMode';
import UserDetails from './UserDetails/UserDetails';
import CallDetails from './CallDetails/CallDetails';
import AdminLogin from './AdminLogin/AdminLogin';
import UserEngagement from './UserEngagement';
import { ConfigProvider, theme } from 'antd';
import UsersList from './UserList/UserList';
import CallList from './CallList/CallList';
import EventDetails from './EventDetails';

const App = () => {
  const appVersion = '6.9.4';
  const { darkMode } = useDarkMode();
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );

  const handleLogout = () => {
    setIsLoggedIn(false);
    window.location.reload();
    localStorage.clear();
    sessionStorage.clear();
    localStorage.setItem('appVersion', appVersion);
  };

  useEffect(() => {
    const storedVersion = localStorage.getItem('appVersion');
    if (storedVersion !== appVersion) handleLogout();
  }, []);

  return (
    <ConfigProvider theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
      <div className='dark:text-white min-w-screen min-h-screen overflow-clip dark:bg-darkBlack'>
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="*" element={<Navigate to="/admin/home" />} />
              <Route path="/admin/calls" element={<CallList />} />
              <Route path="/admin/users" element={<UsersList />} />
              <Route path="/admin/calls/:callId" element={<CallDetails />} />
              <Route path="/admin/users/:userId" element={<UserDetails />} />
              <Route path="/admin/userEngage" element={<UserEngagement />} />
              <Route path="/admin/events/:slug" element={<EventDetails />} />
              <Route path="/admin/experts/:number" element={<ExpertDetails />} />
              <Route path="/admin/home/*" element={<AdminDashboard onLogout={handleLogout} />} />
              <Route path="/admin/contribute/:slug" element={<EventDetails contribute={true} />} />
            </>
          ) : (
            <>
              <Route path="/genImage" element={<GenerateImage />} />
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
