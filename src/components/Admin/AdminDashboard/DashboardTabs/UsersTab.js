// components/Admin/AdminDashboard/UsersTab.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from '../Popup';
import Histograms from './Histograms'; // Import the Histograms component

const UsersTab = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [currentDayTotalUsers, setCurrentDayTotalUsers] = useState(0);
  const [oneCallUsers, setOneCallUsers] = useState([]);
  const [twoCallsUsers, setTwoCallsUsers] = useState([]);
  const [moreThanTwoCallsUsers, setMoreThanTwoCallsUsers] = useState([]);
  const [popupContent, setPopupContent] = useState({ title: '', users: [] });
  const [activeUsersList, setActiveUsersList] = useState([]);
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, successfulCallsResponse] = await Promise.all([
          axios.get('/api/users'),
          axios.get('/api/successful-calls')
        ]);

        const usersData = usersResponse.data;
        const successfulCallsData = successfulCallsResponse.data;

        const currentDate = new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).split(',')[0];

        const currentDayTotalUsersCount = usersData.filter(user => {
          const userDate = new Date(user.createdDate).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).split(',')[0];
          return userDate === currentDate;
        }).length;

        setCurrentDayTotalUsers(currentDayTotalUsersCount);

        const uniqueUsers = new Set(successfulCallsData.map(call => call.user));
        const activeUsersCount = uniqueUsers.size;
        setActiveUsers(activeUsersCount);

        const activeUsersIds = Array.from(uniqueUsers);
        const activeUsersListData = usersData.filter(user => activeUsersIds.includes(user._id));
        setActiveUsersList(activeUsersListData);

        const callCounts = {};
        successfulCallsData.forEach(call => {
          const userId = call.user;
          callCounts[userId] = (callCounts[userId] || 0) + 1;
        });

        const oneCallUsersList = usersData.filter(user => callCounts[user._id] === 1);
        const twoCallsUsersList = usersData.filter(user => callCounts[user._id] === 2);
        const moreThanTwoCallsUsersList = usersData.filter(user => callCounts[user._id] > 2);

        setOneCallUsers(oneCallUsersList);
        setTwoCallsUsers(twoCallsUsersList);
        setMoreThanTwoCallsUsers(moreThanTwoCallsUsersList);

        setTotalUsers(usersData.length);
        setUsersData(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
            {/* <div className="grid-tile-1" onClick={() => openPopup('Active Users', activeUsersList)}>
              <h3>Active Users</h3>
              <h1>{activeUsers}</h1>
              <p style={{ textAlign: 'right', margin: '0' }}>&gt;2m</p>
            </div> */}
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
      <Histograms usersData={usersData} />
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