import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollBottom from '../AdminDashboard/ScrollBottom';
import './CallList.css';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMissedIcon from '@mui/icons-material/CallMissed';
import { useCallsData } from '../../../services/useData';
import { red, pink, green, yellow } from '@mui/material/colors';

const CallsTable = () => {
  const { calls } = useCallsData();
  const [filters, setFilters] = useState({
    user: '',
    expert: '',
    status: '',
  });
  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    if (key === 'ConversationScore') {
      if (sortConfig.key === key) {
        direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
      }
    }
    setSortConfig({ key, direction });
  };

  const renderStatusIcon = (status) => {
    switch (status) {
      case 'failed':
        return <CloseIcon sx={{ color: red[500] }} />;
      case 'missed':
        return <CallMissedIcon sx={{ color: pink[500] }} />;
      case 'successful':
        return <CheckIcon sx={{ color: green[500] }} />;
      default:
        return <CallReceivedIcon sx={{ color: yellow[500] }} />;
    }
  }

  let filteredCalls = calls.filter((call) => {
    return (
      call.userName.toLowerCase().includes(filters.user.toLowerCase()) &&
      call.expertName.toLowerCase().includes(filters.expert.toLowerCase()) &&
      call.status.toLowerCase().includes(filters.status.toLowerCase())
    );
  });

  if (sortConfig.key) {
    filteredCalls.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }

  const renderSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return null;
  };

  return (
    <div className="table-container">
      <div className="dashboard-tile">
        <div className='latest-wrapper'>
          <table className="calls-table">
            <thead>
              <tr className="filter-row">
                <td>
                  <input
                    type="text"
                    placeholder="Search User"
                    name="user"
                    value={filters.user}
                    onChange={handleFilterChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Search Expert"
                    name="expert"
                    value={filters.expert}
                    onChange={handleFilterChange}
                  />
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <th onClick={() => handleSort('userName')}>
                  User {renderSortArrow('userName')}
                </th>
                <th onClick={() => handleSort('expertName')}>
                  Expert {renderSortArrow('expertName')}
                </th>
                <th>Time</th>
                <th onClick={() => handleSort('duration')}>
                  Duration {renderSortArrow('duration')}
                </th>
                <th style={{ textAlign: 'center' }} onClick={() => handleSort('status')}>
                  Status {renderSortArrow('status')}
                </th>
                <th onClick={() => handleSort('ConversationScore')}>
                  Score {renderSortArrow('ConversationScore')}
                </th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredCalls.map((call) => (
                <tr key={call.callId} className='default-row'>
                  <td>{renderStatusIcon(call.status)} {call.userName}</td>
                  <td>{call.expertName}</td>
                  <td>{new Date(call.initiatedTime).toLocaleString()}</td>
                  <td>{call.duration} min</td>
                  <td style={{ textAlign: 'center' }}>{call.status}</td>
                  <td>{call.ConversationScore}</td>
                  <td>
                    <Link to={`/admin/calls/${call.callId}`} className="view-details-link">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/admin/experts" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 className="experts-button">View All Experts</h1>
          </Link>
          <Link to="/admin/calls" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 className="calls-button">View All Calls</h1>
          </Link>
          <Link to="/admin/users" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 className="users-button">View All Users</h1>
          </Link>
          <ScrollBottom />
        </div>
      </div>
    </div>
  );
};

export default CallsTable;