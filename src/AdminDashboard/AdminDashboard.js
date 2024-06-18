import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardTab from './DashboardTabs/DashboardTab';
import SaarthisTab from './DashboardTabs/ExpertsTab';
import UsersTab from './DashboardTabs/UsersTab';
import ApplicationsTab from './DashboardTabs/ApplicationsTab';
import SchedulerTab from './DashboardTabs/SchedulerTab';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import ThemeToggle from '../components/ThemeToggle/toggle';
import ErrorLogsComponent from './DashboardTabs/Notifications';
import Raxios from '../services/axiosHelper';
import LazyLoad from '../components/LazyLoad/lazyload';
import EventsTab from './DashboardTabs/EventsTab';
import CallsTable from '../CallList/CallList';
import UserList from '../UserList/UserList';
import ContentTab from './DashboardTabs/ContentTab';
import { firebaseConfig } from './firebaseConfig';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { useCalls, useExperts, useUsers, useLeads, useSchedules, useApplications, useErrorLogs } from '../services/useData';
import GamesTab from './DashboardTabs/GamesTab';

export const LoadingContext = React.createContext();

const AdminDashboard = ({ onLogout }) => {
  const { fetchCalls } = useCalls();
  const { fetchExperts } = useExperts();
  const { fetchUsers } = useUsers();
  const { fetchLeads } = useLeads();
  const { fetchSchedules } = useSchedules();
  const { fetchApplications } = useApplications();
  const { fetchErrorLogs } = useErrorLogs();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const localStorageDarkMode = localStorage.getItem('darkMode');
    if (localStorageDarkMode !== null) {
      return JSON.parse(localStorageDarkMode);
    } else {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
  };

  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      localStorage.setItem('darkMode', 'true');
      document.body.classList.add('dark');
    } else {
      localStorage.setItem('darkMode', 'false');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    fetchData();

    const storedTab = localStorage.getItem('adminActiveTab');
    if (location.state && location.state.activeTab) {
      setActiveTab(location.state.activeTab);
    } else if (storedTab) {
      setActiveTab(storedTab);
    }

    // eslint-disable-next-line
  }, [location.state]);

  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    try {
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
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
    }
  }, []);

  const sendFCMTokenToServer = async (token) => {
    try {
      await Raxios.post('/service/save-fcm-token', { token });
    } catch (error) {
      console.error('Failed to send FCM token to server:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchExperts(),
      fetchUsers(),
      fetchCalls(),
      fetchSchedules(),
      fetchApplications(),
      fetchLeads(),
      fetchErrorLogs(),
    ]);
    setLoading(false);
  };

  const Tab = ({ label, onClick, active }) => (
    <div
      className={`cshadow p-2 px-4 my-2 rounded-3xl font-bold text-xl hover:scale-110 transition-all cursor-pointer dark:bg-lightBlack 
        ${active ? 'scale-110' : ''
        }`}
      onClick={() => {
        onClick();
        setShowMenu(false); // Close the menu when a tab is selected
      }}
    >
      {label}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'calls list':
        return <CallsTable />;
      case 'experts list':
        return <SaarthisTab />;
      case 'users':
        return <UsersTab />;
      case 'applications':
        return <ApplicationsTab />;
      case 'notifications':
        return <ErrorLogsComponent />;
      case 'scheduler':
        return <SchedulerTab />;
      case 'events':
        return <EventsTab />;
      case 'users list':
        return <UserList />;
      case 'games':
        return <GamesTab />;
      case 'content':
        return <ContentTab />;
      default:
        return null;
    }
  };

  const onMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleMouseEnter = () => {
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    setShowMenu(false);
  };

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <LazyLoad>
        <div className="flex flex-row">
          {!showMenu ? (
            <div
              className="fixed z-50 left-0 top-0 rounded-r-full rounded-br-full h-screen cursor-pointer bg-black bg-opacity-50 flex items-center"
              onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <KeyboardArrowRightIcon />
            </div>
          ) : (
            <div className={`fixed z-50 left-0 top-0 flex flex-row w-screen bg-opacity-70 bg-black ${showMenu ? 'slide-in' : 'slide-out'}`} onClick={onMenuToggle}>
              <div className={`flex flex-col h-screen p-4 w-1/8 bg-gray-100 dark:bg-darkBlack ${showMenu ? 'slide-in' : 'slide-out'}`}>
                <img src="/logo.svg" alt="logo" className="max-h-24" />
                <div className='flex flex-col h-full justify-between'>
                  <div>
                    {['dashboard', 'users', 'applications', 'events', 'scheduler', 'calls list', 'experts list', 'users list', 'games', 'content'].map((tab) => (
                      <Tab
                        key={tab}
                        label={tab.charAt(0).toUpperCase() + tab.slice(1)}
                        onClick={() => setActiveTab(tab)}
                        active={activeTab === tab}
                      />
                    ))}
                  </div>
                  <div className='grid grid-rows-2'>
                    <Tab label="Notifications" onClick={() => setActiveTab('notifications')} active={activeTab === 'notifications'} />
                    <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                    <Tab label="Logout" onClick={onLogout} />
                  </div>
                </div>
              </div>
              <div className='grid w-screen h-screen items-center cursor-pointer' onClick={onMenuToggle}>
                <KeyboardArrowLeftIcon />
              </div>
            </div>
          )}
          <div className="flex-1 px-10 min-h-screen overflow-auto">{renderTabContent()}</div>
        </div>
      </LazyLoad>
    </LoadingContext.Provider>
  );
};

export default AdminDashboard;
