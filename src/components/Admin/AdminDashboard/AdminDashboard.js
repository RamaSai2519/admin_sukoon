import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardTab from './DashboardTabs/DashboardTab';
import OnlineSaarthisTab from './DashboardTabs/SaarthisTab';
import UsersTab from './DashboardTabs/UsersTab';
import ScrollBottom from './ScrollBottom';
import './AdminDashboard.css';
import socketIOClient from 'socket.io-client';
import ErrorLogsComponent from './DashboardTabs/Notifications';

const Tab = ({ label, onClick, active }) => (
  <div className={`tab ${active ? 'active' : ''}`} onClick={onClick}>
    {label}
  </div>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem('adminActiveTab') || 'dashboard'
  );
  const [errors, setErrors] = useState([]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('adminActiveTab', tab);
  };

  useEffect(() => {
    const lastActiveTab = localStorage.getItem('adminActiveTab');
    if (lastActiveTab) {
      setActiveTab(lastActiveTab);
    }

    // Connect to the Socket.IO server
    const socket = socketIOClient('/socket');

    // Listen for error notifications from the server
    socket.on('error_notification', (data) => {
      setErrors((prevErrors) => [...prevErrors, data]);
    });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Function to close an error message
  const handleCloseError = (index) => {
    setErrors((prevErrors) => {
      const updatedErrors = [...prevErrors];
      updatedErrors.splice(index, 1);
      return updatedErrors;
    });
  };

  return (
    <div className="admin-dashboard-container">
      <h1 className='Title'>Admin Dashboard</h1>


      <div className="tabs-container">
        <div className="tabs">
          <Tab
            label="Dashboard"
            onClick={() => handleTabClick('dashboard')}
            active={activeTab === 'dashboard'}
          />
          <Tab
            label="Users"
            onClick={() => handleTabClick('users')}
            active={activeTab === 'users'}
          />
          <Tab
            label="Saarthis"
            onClick={() => handleTabClick('onlineSaarthis')}
            active={activeTab === 'onlineSaarthis'}
          />
        </div>
        <div className="tabs">
          <Tab label="Notifications"
            onClick={() => handleTabClick('notifications')}
            active={activeTab === 'notifications'}
          />
        </div>
      </div>

      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'onlineSaarthis' && <OnlineSaarthisTab />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'notifications' && <ErrorLogsComponent />}

      <Link to="/calls" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 className="calls-button">View All Calls</h1>
      </Link>

      <ScrollBottom />
      <div className="error-messages-container">
        {errors.map((error, index) => (
          <div key={index} className="error-message">
            {error}
            <button className="close-button" onClick={() => handleCloseError(index)}>
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
