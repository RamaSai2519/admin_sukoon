import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DashboardTab from './DashboardTabs/DashboardTab';
import OnlineSaarthisTab from './DashboardTabs/SaarthisTab';
import UsersTab from './DashboardTabs/UsersTab';
import ApplicationsTab from './DashboardTabs/ApplicationsTab';
import SchedulerTab from './DashboardTabs/Scheduler/SchedulerTab';
import ScrollBottom from './ScrollBottom';
import './AdminDashboard.css';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import ErrorLogsComponent from './DashboardTabs/Notifications';

const firebaseConfig = {
  apiKey: "AIzaSyAJTlUxbEndDBjZBvDJUXGJBelkQHXfNAI",
  authDomain: "for-everyone-2519.firebaseapp.com",
  projectId: "for-everyone-2519",
  storageBucket: "for-everyone-2519.appspot.com",
  messagingSenderId: "221608439000",
  appId: "1:221608439000:web:8d3b9e17733071addbbbad",
  measurementId: "G-3H59FDN20X"
};

const Tab = ({ label, onClick, active }) => (
  <div className={`tab ${active ? 'active' : ''}`} onClick={onClick}>
    {label}
  </div>
);

const AdminDashboard = () => {
  const location = useLocation();
  const [errors, setErrors] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const storedTab = localStorage.getItem('adminActiveTab');
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    } else if (storedTab) {
      setActiveTab(storedTab);
    }
  }, [location.state]);

  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
          .catch((err) => {
            console.error('Service worker registration failed: ', err);
          });
      });
    }

    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);
    getToken(messaging, { vapidKey: 'BMLRhMhDBoEX1EBBdQHIbPEsVHsZlWixm5tCKH4jJmZgzW4meFmYqGEu8xdY-J1TKmISjTI6hbYMEzcMicd3AKo' })
      .then((currentToken) => {
        if (currentToken) {
          sendFCMTokenToServer(currentToken);
        }
      })
  }, []);

  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  const handleCloseError = (index) => {
    setErrors((prevErrors) => {
      const updatedErrors = [...prevErrors];
      updatedErrors.splice(index, 1);
      return updatedErrors;
    });
  };

  const sendFCMTokenToServer = (token) => {
    fetch('/api/save-fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
      .then((response) => {
        if (response.ok) {
        } else {
          console.error('Failed to send FCM token to server');
        }
      });
  };

  return (
    <div className="admin-dashboard-container">
      <h1 className="Title">Admin Dashboard</h1>

      <div className="tabs-container">
        <div className="tabs">
          <Tab
            label="Dashboard"
            onClick={() => setActiveTab('dashboard')}
            active={activeTab === 'dashboard'}
          />
          <Tab
            label="Users"
            onClick={() => setActiveTab('users')}
            active={activeTab === 'users'}
          />
          <Tab
            label="Saarthis"
            onClick={() => setActiveTab('onlineSaarthis')}
            active={activeTab === 'onlineSaarthis'}
          />
        </div>
        <div className="tabs">
          <Tab
            label="Applications"
            onClick={() => setActiveTab('applications')}
            active={activeTab === 'applications'}
          />
          <Tab
            label="Scheduler"
            onClick={() => setActiveTab('scheduler')}
            active={activeTab === 'scheduler'}
          />
          <Tab
            label="Errors"
            onClick={() => setActiveTab('notifications')}
            active={activeTab === 'notifications'}
          />
        </div>
      </div>

      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'onlineSaarthis' && <OnlineSaarthisTab />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'applications' && <ApplicationsTab />}
      {activeTab === 'notifications' && <ErrorLogsComponent />}
      {activeTab === 'scheduler' && <SchedulerTab />}

      <Link to="/admin/experts" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 className="experts-button">View All Experts</h1>
      </Link>
      <Link to="/admin/calls" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 className="calls-button">View All Calls</h1>
      </Link>
      <Link to="/admin/users" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 className="users-button">View All Users</h1>
      </Link>
      <ScrollBottom />
      <div className="error-messages-container">
        {errors.map((error, index) => (
          <div key={index} className="error-message">
            {error}
            <button
              className="close-button"
              onClick={() => handleCloseError(index)}
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;