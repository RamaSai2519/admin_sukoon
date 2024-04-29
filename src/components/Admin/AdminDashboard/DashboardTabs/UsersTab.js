import React, { useState, useEffect } from 'react';
import Popup from '../Popup';
import Histograms from './Histograms';
import useCallsData from '../../../../services/useCallsData';
import useUserManagement from '../../../../services/useUserManagement';

const UsersTab = () => {
  const { users } = useUserManagement();
  const { calls } = useCallsData();

  const [totalUsers, setTotalUsers] = useState(0);
  const [currentDayTotalUsers, setCurrentDayTotalUsers] = useState(0);
  const [oneCallUsers, setOneCallUsers] = useState([]);
  const [twoCallsUsers, setTwoCallsUsers] = useState([]);
  const [moreThanTwoCallsUsers, setMoreThanTwoCallsUsers] = useState([]);
  const [popupContent, setPopupContent] = useState({ title: '', users: [] });

  useEffect(() => {
    const currentDate = new Date().toLocaleDateString();
    const currentDayTotalUsersCount = users.filter(user => new Date(user.createdDate).toLocaleDateString() === currentDate).length;
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
  }, [users, calls]);

  const openPopup = (title, users) => {
    setPopupContent({ title, users });
  };

  const closePopup = () => {
    setPopupContent({ title: '', users: [] });
  };

  return (
    <div className="users-tab">
      <div className="dashboard-tiles">
        <div className="dashboard-tile">
          <div className="grid-row">
            <div className="grid-tile-1">
              <h3>User Signups</h3>
              <h1>{totalUsers}</h1>
              <h4>Today: {currentDayTotalUsers}</h4>
            </div>
            <div className="grid-tile-1" onClick={() => openPopup('Users with One Call', oneCallUsers)}>
              <h3>Users with One Call</h3>
              <h1>{oneCallUsers.length}</h1>
            </div>
            <div className="grid-tile-1" onClick={() => openPopup('Users with Two Calls', twoCallsUsers)}>
              <h3>Users with Two Calls</h3>
              <h1>{twoCallsUsers.length}</h1>
            </div>
            <div className="grid-tile-1" onClick={() => openPopup('Users with More than Two Calls', moreThanTwoCallsUsers)}>
              <h3>Users with More than Two Calls</h3>
              <h1>{moreThanTwoCallsUsers.length}</h1>
            </div>
          </div>
        </div>
      </div>
      <Histograms usersData={users} />
      {popupContent.title && (
        <Popup
          title={popupContent.title}
          users={popupContent.users}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default UsersTab;