// CallList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ScrollBottom from '../AdminDashboard/ScrollBottom';
import './CallList.css';

const CallsTable = () => {
  const [lastFiveCalls, setLastFiveCalls] = useState([]);
  const [filters, setFilters] = useState({
    user: '',
    expert: '',
    time: '',
    duration: '',
    status: '',
  });

  useEffect(() => {
    fetchLastFiveCalls();
  }, []);

  const fetchLastFiveCalls = async () => {
    try {
      const response = await axios.get('http://15.206.127.248/api/all-calls');
      setLastFiveCalls(response.data.reverse());
    } catch (error) {
      console.error('Error fetching last five calls:', error);
    }
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

  const handleFilterChange = (e, column) => {
    const value = e.target.value;
    setFilters({
      ...filters,
      [column]: value,
    });
  };

  const applyFilters = (call) => {
    const { user, expert, time, duration, status } = filters;
    return (
      call.userName.toLowerCase().includes(user.toLowerCase()) &&
      call.expertName.toLowerCase().includes(expert.toLowerCase()) &&
      new Date(call.initiatedTime).toLocaleString().includes(time) &&
      call.duration.toString().includes(duration) &&
      call.status.toLowerCase().includes(status.toLowerCase())
    );
  };

  return (
    <div className="table-container">
      <table className="last-five-calls-table">
        <thead>
          <tr>
            <th>
              <input
                type="text"
                placeholder="Filter User"
                value={filters.user}
                onChange={(e) => handleFilterChange(e, 'user')}
              />
            </th>
            <th>
              <input
                type="text"
                placeholder="Filter Expert"
                value={filters.expert}
                onChange={(e) => handleFilterChange(e, 'expert')}
              />
            </th>
            <th>
              Time
            </th>
            <th>
              Duration
            </th>
            <th>
              <input
                type="text"
                placeholder="Filter Status"
                value={filters.status}
                onChange={(e) => handleFilterChange(e, 'status')}
              />
            </th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {lastFiveCalls.map((call, index) => (
            applyFilters(call) && (
              <tr key={call._id} className={getStatusColor(call.status)}>
                <td>{call.userName}</td>
                <td>{call.expertName}</td>
                <td>{new Date(call.initiatedTime).toLocaleString()}</td>
                <td>{call.duration} min</td>
                <td>{call.status}</td>
                <td>
                  <Link to={`/calls/${call.callId}`} className="view-details-link">
                    View
                  </Link>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>
      <ScrollBottom />
    </div>
  );
};

export default CallsTable;
