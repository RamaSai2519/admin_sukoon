// src/components/Admin/AdminDashboard/AdminDashboard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardTab from './DashboardTabs/DashboardTab';
import OnlineSaarthisTab from './DashboardTabs/SaarthisTab';
import UsersTab from './DashboardTabs/UsersTab';
import ScrollBottom from './ScrollBottom';
import './AdminDashboard.css';

const Tab = ({ label, onClick, active }) => (
  <div className={`tab ${active ? 'active' : ''}`} onClick={onClick}>
    {label}
  </div>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
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
