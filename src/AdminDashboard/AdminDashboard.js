import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import DashboardTab from './DashboardTabs/DashboardTab';
import SaarthisTab from './DashboardTabs/ExpertsTab';
import UsersTab from './DashboardTabs/UsersTab';
import ApplicationsTab from './DashboardTabs/ApplicationsTab';
import SchedulerTab from './DashboardTabs/SchedulerTab';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import ThemeToggle from '../components/ThemeToggle/toggle';
import NotificationsTab from './DashboardTabs/Notifications';
import LazyLoad from '../components/LazyLoad/lazyload';
import EventsTab from './DashboardTabs/EventsTab';
import CallsTable from '../CallList/CallList';
import UserList from '../UserList/UserList';
import ContentTab from './DashboardTabs/ContentTab';
import GamesTab from './DashboardTabs/GamesTab';
import WhatsappTab from './DashboardTabs/WhatsappTab';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import Raxios from '../services/axiosHelper';
import firebaseConfig from './firebaseConfig';

const AdminDashboard = ({ onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const localStorageDarkMode = localStorage.getItem('darkMode');
    if (localStorageDarkMode !== null) {
      return JSON.parse(localStorageDarkMode);
    } else {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  });

  const location = useLocation();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
  };

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
    const activeTab = location.pathname.split('/').pop();
    localStorage.setItem('adminActiveTab', activeTab);
  }, [location]);

  const onMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleMouseEnter = () => {
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    setShowMenu(false);
  };

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

  return (
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
                <div className='grid gap-2'>
                  {['dashboard', 'users', 'applications', 'events', 'scheduler', 'calls list', 'experts list', 'users list', 'games', 'content', 'whatsapp'].map((tab) => (
                    <Link
                      key={tab}
                      to={`/admin/home/${tab}`}
                      className={`cshadow p-2 px-4 rounded-3xl font-bold text-xl hover:scale-110 transition-all cursor-pointer dark:bg-lightBlack 
                          ${location.pathname.endsWith(tab) ? 'scale-110' : ''
                        }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Link>
                  ))}
                </div>
                <div className='grid grid-rows-2'>
                  <Link to="/admin/home/notifications" className={`cshadow p-2 px-4 my-1 rounded-3xl font-bold text-xl hover:scale-110 transition-all cursor-pointer dark:bg-lightBlack 
                      ${location.pathname.endsWith('notifications') ? 'scale-110' : ''
                    }`}>
                    Notifications
                  </Link>
                  <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                  <div
                    className="cshadow p-2 px-4 my-2 rounded-3xl font-bold text-xl hover:scale-110 transition-all cursor-pointer dark:bg-lightBlack"
                    onClick={onLogout}
                  >
                    Logout
                  </div>
                </div>
              </div>
            </div>
            <div className='grid w-screen h-screen items-center cursor-pointer' onClick={onMenuToggle}>
              <KeyboardArrowLeftIcon />
            </div>
          </div>
        )}
        <div className="flex-1 px-10 min-h-screen overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardTab />} />
            <Route path="dashboard" element={<DashboardTab />} />
            <Route path="calls list" element={<CallsTable />} />
            <Route path="experts list" element={<SaarthisTab />} />
            <Route path="users" element={<UsersTab />} />
            <Route path="applications" element={<ApplicationsTab />} />
            <Route path="notifications" element={<NotificationsTab />} />
            <Route path="scheduler" element={<SchedulerTab />} />
            <Route path="events" element={<EventsTab />} />
            <Route path="users list" element={<UserList />} />
            <Route path="games" element={<GamesTab />} />
            <Route path="content" element={<ContentTab />} />
            <Route path="whatsapp" element={<WhatsappTab />} />
          </Routes>
        </div>
      </div>
    </LazyLoad>
  );
};

export default AdminDashboard;
