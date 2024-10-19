import UserList from '../UserList/UserList';
import { ConfigProvider, theme } from 'antd';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebaseConfig';
import CallsTable from '../CallList/CallList';
import Raxios from '../services/axiosHelper';
import UsersTab from './DashboardTabs/UsersTab';
import EventsTab from './DashboardTabs/EventsTab';
import React, { useState, useEffect } from 'react';
import ContentTab from './DashboardTabs/ContentTab';
import ClubSukoon from './DashboardTabs/ClubSukoon';
import SaarthisTab from './DashboardTabs/ExpertsTab';
import WhatsappTab from './DashboardTabs/WhatsappTab';
import LazyLoad from '../components/LazyLoad/lazyload';
import DashboardTab from './DashboardTabs/DashboardTab';
import SchedulerTab from './DashboardTabs/SchedulerTab';
import ReferralsTab from './DashboardTabs/ReferralsTab';
import ThemeToggle from '../components/ThemeToggle/toggle';
import { getMessaging, getToken } from 'firebase/messaging';
import ApplicationsTab from './DashboardTabs/ApplicationsTab';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';

const AdminDashboard = ({ onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);

  // Dark mode
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

  useEffect(() => {
    if (darkMode) {
      localStorage.setItem('darkMode', 'true');
      document.body.classList.add('dark');
    } else {
      localStorage.setItem('darkMode', 'false');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);


  const location = useLocation();
  useEffect(() => {
    const activeTab = location.pathname.split('/').pop();
    localStorage.setItem('adminActiveTab', activeTab);
  }, [location]);

  const onMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const app = initializeApp(firebaseConfig);
          const messaging = getMessaging(app);
          getToken(messaging, { vapidKey: 'BMLRhMhDBoEX1EBBdQHIbPEsVHsZlWixm5tCKH4jJmZgzW4meFmYqGEu8xdY-J1TKmISjTI6hbYMEzcMicd3AKo' })
            .then((currentToken) => {
              if (currentToken) {
                sendFCMTokenToServer(currentToken);
              }
            });
        } else {
          console.error('Notification permission denied');
        }
      } catch (error) {
        console.error('Failed to request notification permission:', error);
      }
    };

    requestNotificationPermission();
  }, []);

  const sendFCMTokenToServer = async (token) => {
    try {
      await Raxios.post('/save_fcm_token', { token });
    } catch (error) {
      console.error('Failed to send FCM token to server:', error);
    }
  };

  const pages = [
    { name: 'dashboard', component: <DashboardTab /> },
    { name: 'users', component: <UsersTab /> },
    { name: 'users list', component: <UserList /> },
    { name: 'experts list', component: <SaarthisTab /> },
    { name: 'calls list', component: <CallsTable /> },
    { name: 'events', component: <EventsTab /> },
    { name: 'scheduler', component: <SchedulerTab /> },
    { name: 'whatsapp', component: <WhatsappTab /> },
    { name: 'applications', component: <ApplicationsTab /> },
    { name: 'club', component: <ClubSukoon /> },
    { name: 'referrals', component: <ReferralsTab /> },
    { name: 'content', component: <ContentTab /> }
  ];

  return (
    <ConfigProvider theme={
      {
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }
    }>
      <LazyLoad>
        <div className="flex flex-row">
          {!showMenu ? (
            <div
              className="fixed z-50 left-0 top-0 rounded-r-full rounded-br-full h-screen cursor-pointer bg-black bg-opacity-50 flex items-center"
              onMouseEnter={() => setShowMenu(true)} onMouseLeave={() => setShowMenu(false)}>
              <KeyboardArrowRightIcon />
            </div>
          ) : (
            <div className={`fixed z-50 left-0 top-0 flex flex-row w-screen bg-opacity-70 bg-black ${showMenu ? 'slide-in' : 'slide-out'}`} onClick={onMenuToggle}>
              <div className={`flex flex-col h-screen p-4 w-1/8 bg-gray-100 dark:bg-darkBlack ${showMenu ? 'slide-in' : 'slide-out'}`}>
                <div className='flex flex-col h-full justify-between'>
                  <div className='grid gap-2'>
                    {pages.map(({ name }) => (
                      <Link
                        key={name}
                        to={`/admin/home/${name}`}
                        className={`cshadow p-2 px-4 rounded-3xl font-bold text-lg hover:scale-110 transition-all cursor-pointer dark:bg-lightBlack 
                          ${location.pathname.endsWith(name) ? 'scale-110' : ''}`}
                      >
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </Link>
                    ))}
                  </div>
                  <div className='grid grid-rows-2'>
                    <Link to="/admin/home/notifications" className={`cshadow p-2 px-4 my-1 rounded-3xl font-bold text-lg hover:scale-110 transition-all cursor-pointer dark:bg-lightBlack 
                      ${location.pathname.endsWith('notifications') ? 'scale-110' : ''
                      }`}>
                      Notifications
                    </Link>
                    <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                    <div
                      className="cshadow p-2 px-4 my-2 rounded-3xl font-bold text-lg hover:scale-110 transition-all cursor-pointer dark:bg-lightBlack"
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
              {pages.map(({ name, component }) => (
                <Route key={name} path={name} element={component} />
              ))}
              <Route path="/" element={<Navigate to="/admin/home/dashboard" />} />
            </Routes>
          </div>
        </div>
      </LazyLoad>
    </ConfigProvider>
  );
};

export default AdminDashboard;
