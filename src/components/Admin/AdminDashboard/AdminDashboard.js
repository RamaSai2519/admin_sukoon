import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardTab from './DashboardTabs/DashboardTab';
import OnlineSaarthisTab from './DashboardTabs/SaarthisTab';
import UsersTab from './DashboardTabs/UsersTab';
import ScrollBottom from './ScrollBottom';
import Popup from './Popup'; // Import the Popup component
import './AdminDashboard.css';

const Tab = ({ label, onClick, active }) => (
  <div className={`tab ${active ? 'active' : ''}`} onClick={onClick}>
    {label}
  </div>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem('adminActiveTab') || 'dashboard'
  );

  const [errorNotification, setErrorNotification] = useState('');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('adminActiveTab', tab);
  };

  useEffect(() => {
    const lastActiveTab = localStorage.getItem('adminActiveTab');
    if (lastActiveTab) {
      setActiveTab(lastActiveTab);
    }
  }, []);

  const handleClosePopup = () => {
    setErrorNotification('');
  };

  return (
    <div className="admin-dashboard-container">
      <h1 className='Title'>Admin Dashboard</h1>

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

      {errorNotification && <Popup message={errorNotification} onClose={handleClosePopup} />} {/* Render the Popup component if there's a notification */}

      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'onlineSaarthis' && <OnlineSaarthisTab />}
      {activeTab === 'users' && <UsersTab />}

      <Link to="/calls" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 className="calls-button">View All Calls</h1>
      </Link>

      <ScrollBottom />
    </div>
  );
};

export default AdminDashboard;