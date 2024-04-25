import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardTab from './DashboardTabs/DashboardTab';
import OnlineSaarthisTab from './DashboardTabs/SaarthisTab';
import UsersTab from './DashboardTabs/UsersTab';
import ScrollBottom from './ScrollBottom';
import './AdminDashboard.css';
import socketIOClient from 'socket.io-client';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
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
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem('adminActiveTab') || 'dashboard'
  );
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    // Register a service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
          .then((registration) => {
            console.log('Service worker registered: ', registration);
          })
          .catch((err) => {
            console.error('Service worker registration failed: ', err);
          });
      });
    }

    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
    });
    getToken(messaging, { vapidKey: 'BMLRhMhDBoEX1EBBdQHIbPEsVHsZlWixm5tCKH4jJmZgzW4meFmYqGEu8xdY-J1TKmISjTI6hbYMEzcMicd3AKo' })
      .then((currentToken) => {
        if (currentToken) {
          console.log('Current token:', currentToken);
          sendFCMTokenToServer(currentToken);
        } else {
          console.log('No token found.');
        }
      })
      .catch((err) => {
        console.log('Error retrieving token:', err);
      });

    const socket = socketIOClient('/api/socket');

    // Listen for error notifications from the server
    socket.on('error_notification', (data) => {
      setErrors((prevErrors) => [...prevErrors, data]);
    });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Function to close an error message
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
          console.log('FCM token sent to server successfully');
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
            label="Notifications"
            onClick={() => setActiveTab('notifications')}
            active={activeTab === 'notifications'}
          />
        </div>
      </div>

      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'onlineSaarthis' && <OnlineSaarthisTab />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'notifications' && <ErrorLogsComponent />}

      <Link to="/calls" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 className="calls-button">View All Calls</h1>
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