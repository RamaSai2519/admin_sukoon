import React, { useState, useEffect, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardTab from './DashboardTabs/DashboardTab';
import OnlineSaarthisTab from './DashboardTabs/SaarthisTab';
import UsersTab from './DashboardTabs/UsersTab';
import ApplicationsTab from './DashboardTabs/ApplicationsTab';
import SchedulerTab from './DashboardTabs/SchedulerTab';
import ScrollBottom from './ScrollBottom';
import useMediaQuery from '../services/useMediaQueryHook';
import ThemeToggle from '../components/ThemeToggle/toggle';
import ErrorLogsComponent from './DashboardTabs/Notifications';
import NavMenu from '../components/NavMenu/NavMenu';
import Raxios from '../services/axiosHelper';
import { useStats, useCalls, useExperts, useUsers, useLeads, useSchedules, useApplications, useErrorLogs } from '../services/useData';
import LazyLoad from '../components/LazyLoad/lazyload';
import { firebaseConfig } from './firebaseConfig';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const AdminDashboard = ({ onLogout,  darkMode, toggleDarkMode }) => {
  const { fetchStats } = useStats();
  const { fetchCalls } = useCalls();
  const { fetchExperts } = useExperts();
  const { fetchUsers } = useUsers();
  const { fetchLeads } = useLeads();
  const { fetchSchedules } = useSchedules();
  const { fetchApplications } = useApplications();
  const { fetchErrorLogs } = useErrorLogs();

  const [activeTab, setActiveTab] = useState('dashboard');
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchCalls(),
        fetchExperts(),
        fetchUsers(),
        fetchLeads(),
        fetchSchedules(),
        fetchApplications(),
        fetchErrorLogs(),
        fetchStats(),
      ]);
    };
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

  const sendFCMTokenToServer = async (token) => {
    try {
      await Raxios.post('/service/save-fcm-token', { token });
    } catch (error) {
      console.error('Failed to send FCM token to server:', error);
    }
  };

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

  const Tab = ({ label, onClick, active }) => (
    <div
      className={`cshadow p-2 px-4 my-2 rounded-3xl font-bold text-xl hover:scale-110 transition-all cursor-pointer dark:bg-lightBlack ${active ? 'scale-110' : ''
        }`}
      onClick={onClick}
    >
      {label}
    </div>
  );

  const isDesktop = useMediaQuery(1240);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'experts':
        return <OnlineSaarthisTab />;
      case 'users':
        return <UsersTab />;
      case 'applications':
        return <ApplicationsTab />;
      case 'notifications':
        return <ErrorLogsComponent />;
      case 'scheduler':
        return <SchedulerTab />;
      default:
        return null;
    }
  };

  return (
    <LazyLoad>
      {isDesktop ? (
        <div className="flex flex-row">
          <div className="flex flex-col h-screen p-4 w-1/8 justify-start bg-gray-100 dark:bg-darkBlack">
            <img src="/logo.svg" alt="logo" className="max-h-24" />
            {['dashboard', 'users', 'experts', 'applications', 'scheduler', 'notifications'].map((tab) => (
              <Tab
                key={tab}
                label={tab.charAt(0).toUpperCase() + tab.slice(1)}
                onClick={() => setActiveTab(tab)}
                active={activeTab === tab}
              />
            ))}
            <Tab label="Logout" onClick={onLogout} />
            <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </div>

          <div className="flex-1 p-4">{renderTabContent()}</div>
        </div>
      ) : (
        <div className="container px-5">
          <div className="flex flex-row flex-wrap gap-4 justify-center">
            {['dashboard', 'users', 'experts', 'applications', 'scheduler', 'notifications'].map((tab) => (
              <Tab
                key={tab}
                label={tab.charAt(0).toUpperCase() + tab.slice(1)}
                onClick={() => setActiveTab(tab)}
                active={activeTab === tab}
              />
            ))}
          </div>

          {renderTabContent()}

          <NavMenu />
          <ScrollBottom />
        </div>
      )}
    </LazyLoad>
  );
};

export default AdminDashboard;
