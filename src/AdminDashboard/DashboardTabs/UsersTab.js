import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Histograms from '../../components/Histograms';
import Popup from '../../components/Popups/Popup';
import LeadsPopup from '../../components/Popups/LeadsPopup';
import DashboardTile from '../../components/DashboardTile';
import { useUsers, useCalls, useLeads } from '../../services/useData';
import LazyLoad from '../../components/LazyLoad/lazyload';
import UserEngagement from '../../UserEngagement';
import { Button, ConfigProvider, theme } from 'antd';

const UsersTab = () => {
  const { users } = useUsers();
  const { calls } = useCalls();
  const { leads } = useLeads();
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentDayTotalUsers, setCurrentDayTotalUsers] = useState(0);
  const [oneCallUsers, setOneCallUsers] = useState([]);
  const [twoCallsUsers, setTwoCallsUsers] = useState([]);
  const [moreThanTwoCallsUsers, setMoreThanTwoCallsUsers] = useState([]);
  const [currentDayPartialSignups, setCurrentDayPartialSignups] = useState([]);
  const [popupContent, setPopupContent] = useState({ title: '', users: [] });
  const darkMode = localStorage.getItem('darkMode') === 'true';

  useEffect(() => {
    const currentDate = new Date().toLocaleDateString();
    const currentDayTotalUsersCount = users.filter(user => new Date(user.createdDate).toLocaleDateString() === currentDate).length;
    const currentDayPartialSignupsCount = leads.filter(lead => new Date(lead.createdDate).toLocaleDateString() === currentDate).length;
    setCurrentDayPartialSignups(currentDayPartialSignupsCount);
    setCurrentDayTotalUsers(currentDayTotalUsersCount);

    const callCounts = {};
    calls.forEach(call => {
      const userId = call.user;
      if (call.status === 'successful') {
        callCounts[userId] = (callCounts[userId] || 0) + 1;
      }
    });

    const oneCallUsersList = users.filter(user => callCounts[user._id] === 1);
    const twoCallsUsersList = users.filter(user => callCounts[user._id] === 2);
    const moreThanTwoCallsUsersList = users.filter(user => callCounts[user._id] > 2);

    setTotalUsers(users.length);
    setOneCallUsers(oneCallUsersList);
    setTwoCallsUsers(twoCallsUsersList);
    setMoreThanTwoCallsUsers(moreThanTwoCallsUsersList);
  }, [users, calls, leads]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        closePopup();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const openPopup = (title, users) => {
    setPopupContent({ title, users });
  };

  const closePopup = () => {
    setPopupContent({ title: '', users: [] });
  };
  
  const nav = useNavigate();

  return (
    <LazyLoad>
      <ConfigProvider theme={
        {
          algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }
      }>
        <div className="w-full min-h-screen">
          <div className="flex flex-wrap justify-between">
            <div className="w-full">
              <div key="button-container" className='flex justify-end mr-3'>
                <Button onClick={() => nav("/admin/userEngage")}>
                  User Engagement
                </Button>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-5">
                <DashboardTile title="Total Signups" pointer='pointer' onClick={() => nav("/admin/users")}>
                  <div className='flex justify-between items-center w-full'>
                    <h1>{totalUsers}</h1>
                    <h4>Today: {currentDayTotalUsers}</h4>
                  </div>
                </DashboardTile>
                <DashboardTile title="One Call Users" pointer='pointer' onClick={() => openPopup('Users with One Call', oneCallUsers)}>
                  <h1 className='cursor-pointer'>{oneCallUsers.length}</h1>
                </DashboardTile>
                <DashboardTile title="Two Calls Users" pointer='pointer' onClick={() => openPopup('Users with Two Calls', twoCallsUsers)}>
                  <h1 className='cursor-pointer'>{twoCallsUsers.length}</h1>
                </DashboardTile>
                <DashboardTile title="Repeat Users" pointer='pointer' onClick={() => openPopup('Users with More than Two Calls', moreThanTwoCallsUsers)}>
                  <h1 className='cursor-pointer'>{moreThanTwoCallsUsers.length}</h1>
                </DashboardTile>
                <DashboardTile title="Partial Signups" pointer='pointer' onClick={() => openPopup('Partial Signups', leads)}>
                  <div className='flex justify-between items-center w-full'>
                    <h1>{leads.length}</h1>
                    <h4>Today: {currentDayPartialSignups}</h4>
                  </div>
                </DashboardTile>
              </div>
            </div>
          </div >
          <Histograms usersData={users} />
          {
            popupContent.title && (
              popupContent.title === 'Partial Signups' ? (
                <LeadsPopup
                  title={popupContent.title}
                  users={popupContent.users}
                  onClose={closePopup}
                />
              ) : (
                <Popup
                  title={popupContent.title}
                  users={popupContent.users}
                  onClose={closePopup}
                />
              )
            )
          }
          <div className='flex justify-center items-center'>
            <h2>Note: Click on the boxes to view details. Total Signups will return all users table.</h2>
          </div>
        </div>
      </ConfigProvider>
    </LazyLoad>
  );
};

export default UsersTab;
