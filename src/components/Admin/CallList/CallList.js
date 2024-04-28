import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ScrollBottom from '../AdminDashboard/ScrollBottom';
import './CallList.css';

const CallsTable = () => {
  const [calls, setCalls] = useState([]);
  const [filters, setFilters] = useState({
    user: '',
    expert: '',
    status: '',
  });
  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: '',
  });

  useEffect(() => {
    const cachedCalls = JSON.parse(localStorage.getItem('calls'));
    if (cachedCalls) {
      setCalls(cachedCalls);
      fetchNewCalls(cachedCalls);
    } else {
      fetchAllCalls();
    }
  }, []);

  const fetchAllCalls = async () => {
    try {
      const response = await axios.get('/api/all-calls');
      setCalls(response.data.reverse());
      localStorage.setItem('calls', JSON.stringify(response.data));
      console.log('All calls fetched');
    } catch (error) {
      console.error('Error fetching all calls:', error);
    }
  };

  const fetchNewCalls = async (cachedCalls) => {
    const latestTimestamp = cachedCalls.length > 0 ? cachedCalls[0].initiatedTime : 0;
    try {
      const response = await axios.get(`/api/new-calls?timestamp=${latestTimestamp}`);
      const newData = response.data;

      if (newData.length > 0) {
        const mergedData = [...newData, ...calls].sort((a, b) => b.initiatedTime - a.initiatedTime);
        setCalls(mergedData);
        localStorage.setItem('calls', JSON.stringify(mergedData));
        console.log('New calls fetched');
      }
    } catch (error) {
      console.error('Error fetching new calls:', error);
    }
  };


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

  const getStatusColor = (status) => {
    switch (status) {
      case 'successfull':
        return 'successful-row';
      case 'initiated':
        return 'initiated-row';
      default:
        return 'default-row';
    }
  };

  let filteredCalls = calls.filter((call) => {
    return (
      call.userName.toLowerCase().includes(filters.user.toLowerCase()) &&
      call.expertName.toLowerCase().includes(filters.expert.toLowerCase()) &&
      call.status.toLowerCase().includes(filters.status.toLowerCase())
    );
  });

  // Sorting the filtered calls based on sortConfig state
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

  // Function to render sort arrow
  const renderSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return null;
  };

  return (
    <div className="table-container">
      <table className="calls-table">
        <thead>
          <tr className="filter-row">
            <td>
              <input
                type="text"
                placeholder="Filter User"
                name="user"
                value={filters.user}
                onChange={handleFilterChange}
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Filter Expert"
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
          {filteredCalls.reverse().map((call) => (
            <tr key={call._id} className={getStatusColor(call.status)}>
              <td>{call.userName}</td>
              <td>{call.expertName}</td>
              <td>{new Date(call.initiatedTime).toLocaleString()}</td>
              <td>{call.duration} min</td>
              <td style={{ textAlign: 'center' }}>{call.status}</td>
              <td>{call.ConversationScore}</td>
              <td>
                <Link to={`/calls/${call.callId}`} className="view-details-link">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/experts" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 className="experts-button">View All Experts</h1>
      </Link>
      <Link to="/calls" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 className="calls-button">View All Calls</h1>
      </Link>
      <Link to="/users" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 className="users-button">View All Users</h1>
      </Link>
      <ScrollBottom />
    </div>
  );
};

export default CallsTable;