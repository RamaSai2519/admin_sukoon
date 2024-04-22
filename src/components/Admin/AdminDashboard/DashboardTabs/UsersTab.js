// components/Admin/AdminDashboard/UsersTab.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Popup from '../Popup';

const UsersTab = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [currentDayTotalUsers, setCurrentDayTotalUsers] = useState(0);
  const [oneCallUsers, setOneCallUsers] = useState([]);
  const [twoCallsUsers, setTwoCallsUsers] = useState([]);
  const [moreThanTwoCallsUsers, setMoreThanTwoCallsUsers] = useState([]);
  const [popupContent, setPopupContent] = useState({ title: '', users: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, successfulCallsResponse] = await Promise.all([
          axios.get('http://15.206.127.248/api/users'),
          axios.get('http://15.206.127.248/api/successful-calls')
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

        const userNamesResponse = await axios.get('http://15.206.127.248/api/users');
        const userNamesData = userNamesResponse.data;

        const oneCallUserNames = userNamesData
          .filter(user => oneCallUsers.includes(user._id))
          .map(user => user.name);

        const twoCallsUserNames = userNamesData
          .filter(user => twoCallsUsers.includes(user._id))
          .map(user => user.name);

        const moreThanTwoCallsUserNames = userNamesData
          .filter(user => moreThanTwoCallsUsers.includes(user._id))
          .map(user => user.name);

        setOneCallUsers(oneCallUserNames);
        setTwoCallsUsers(twoCallsUserNames);
        setMoreThanTwoCallsUsers(moreThanTwoCallsUserNames);

        setTotalUsers(usersData.length);
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
      <div className="dashboard-tile">
        <div className="grid-row">
          <div className="grid-tile-1" onClick={() => openPopup('Users with One Call', oneCallUsers)}>
            <h3>User Signups</h3>
            <h1>{totalUsers}</h1>
            <h4>Today: {currentDayTotalUsers}</h4>
          </div>
          <div className="grid-tile-1" onClick={() => openPopup('Users with Two Calls', twoCallsUsers)}>
            <h3>Active users</h3>
            <h1>{activeUsers}</h1>
            <p style={{ textAlign: 'right', margin: '0' }}>&gt;2m</p>
          </div>
        </div>
        <div className="grid-row">
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