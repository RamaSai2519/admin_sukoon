import React, { useState, useEffect } from 'react';
import Popup from '../Popup';
import Histograms from './Histograms';
import LeadsPopup from './LeadsPopup';
import DashboardTile from '../../DashboardTile/DashboardTile';
import { useData } from '../../../../services/useData';

const UsersTab = () => {
  const { users, calls, leads } = useData();
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentDayTotalUsers, setCurrentDayTotalUsers] = useState(0);
  const [oneCallUsers, setOneCallUsers] = useState([]);
  const [twoCallsUsers, setTwoCallsUsers] = useState([]);
  const [moreThanTwoCallsUsers, setMoreThanTwoCallsUsers] = useState([]);
  const [currentDayPartialSignups, setCurrentDayPartialSignups] = useState([]);
  const [popupContent, setPopupContent] = useState({ title: '', users: [] });

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

  return (
    <div className="container min-h-screen">
      <div className="flex flex-wrap justify-between">
        <div className="w-full">
          <div className="grid grid-cols-3 md:grid-cols-5">
            <DashboardTile title="Total Signups">
              <div className='flex justify-between items-center w-full'>
                <h1>{totalUsers}</h1>
                <h4>Today: {currentDayTotalUsers}</h4>
              </div>
            </DashboardTile>
            <DashboardTile title="One Call Users">
              <h1 className='cursor-pointer' onClick={() => openPopup('Users with One Call', oneCallUsers)}>{oneCallUsers.length}</h1>
            </DashboardTile>
            <DashboardTile title="Two Calls Users">
              <h1 className='cursor-pointer' onClick={() => openPopup('Users with Two Calls', twoCallsUsers)}>{twoCallsUsers.length}</h1>
            </DashboardTile>
            <DashboardTile title=">2 Calls Users">
              <h1 className='cursor-pointer' onClick={() => openPopup('Users with More than Two Calls', moreThanTwoCallsUsers)}>{moreThanTwoCallsUsers.length}</h1>
            </DashboardTile>
            <DashboardTile title="Partial Signups">
              <div className='flex justify-between items-center w-full'>
                <h1 style={{ cursor: "pointer" }}
                  onClick={() => openPopup('Partial Signups', leads)}>{leads.length}</h1>
                <h4>Today: {currentDayPartialSignups}</h4>
              </div>
            </DashboardTile>
          </div>
        </div>
      </div>
      <Histograms usersData={users} />
      {popupContent.title && (
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
      )}
    </div>
  );
};

export default UsersTab;
