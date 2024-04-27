import React, { Suspense, useState, useEffect } from 'react';
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

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024); // Adjust threshold as needed

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 768); // Adjust threshold as needed
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  if (!isDesktop) {
    return <div style={{margin: "150px", marginLeft: "20px", marginRight: "5px"}}>
      <h1>Please use a Laptop or a Desktop to visit this Website.</h1>
      <h1>Will have the mobile version ready after my leave.</h1>
    </div>;
  }

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <div>
        <Suspense fallback={<div>Loading...</div>}>
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
        </Suspense>
      </div>
      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default App;