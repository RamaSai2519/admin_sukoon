import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardTab from './DashboardTabs/DashboardTab';
import OnlineSaarthisTab from './DashboardTabs/SaarthisTab';
import UsersTab from './DashboardTabs/UsersTab';
import ApplicationsTab from './DashboardTabs/ApplicationsTab';
import SchedulerTab from './DashboardTabs/Scheduler/SchedulerTab';
import ScrollBottom from './ScrollBottom';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import ErrorLogsComponent from './DashboardTabs/Notifications';
import NavMenu from '../../NavMenu/NavMenu';
import Raxios from '../../../services/axiosHelper';
import { useData } from '../../../services/useData';

const firebaseConfig = {
  apiKey: "AIzaSyAJTlUxbEndDBjZBvDJUXGJBelkQHXfNAI",
  authDomain: "for-everyone-2519.firebaseapp.com",
  projectId: "for-everyone-2519",
  storageBucket: "for-everyone-2519.appspot.com",
  messagingSenderId: "221608439000",
  appId: "1:221608439000:web:8d3b9e17733071addbbbad",
  measurementId: "G-3H59FDN20X"
};

const AdminDashboard = () => {
  const { fetchData } = useData();
  const location = useLocation();
  const [errors, setErrors] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchData();
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

  const sendFCMTokenToServer = async token => {
    try {
      await Raxios.post('/api/save-fcm-token', { token });
    } catch (error) {
      console.error('Failed to send FCM token to server:', error);
    }
  };

  const Tab = ({ label, onClick, active }) => (
    <div className={`cshadow p-2 px-4 mx-2 rounded-3xl font-bold text-xl hover:scale-125 transition-all cursor-pointer dark:bg-lightBlack ${active ? 'scale-110' : ''}`}
      onClick={onClick}>
      {label}
    </div>
  );

  return (
    <div className="container">
      <div className="flex flex-row flex-wrap justify-center">
        <Tab
          label="Calls"
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
          label="Logs"
          onClick={() => setActiveTab('notifications')}
          active={activeTab === 'notifications'}
        />
      </div>

      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'onlineSaarthis' && <OnlineSaarthisTab />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'applications' && <ApplicationsTab />}
      {activeTab === 'notifications' && <ErrorLogsComponent />}
      {activeTab === 'scheduler' && <SchedulerTab />}

      <NavMenu />
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