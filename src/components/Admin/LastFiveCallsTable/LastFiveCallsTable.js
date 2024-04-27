import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './LastFiveCallsTable.css'; // Import the CSS file

const LastFiveCallsTable = () => {
  const [lastFiveCalls, setLastFiveCalls] = useState([]);
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
    fetchLastFiveCalls();
  }, []);

  const fetchLastFiveCalls = async () => {
    try {
      const response = await axios.get('/api/last-five-calls');
      setLastFiveCalls(response.data);
    } catch (error) {
      console.error('Error fetching last five calls:', error);
    }
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

  let filteredCalls = lastFiveCalls.filter((call) => {
    return (
      call.userName.toLowerCase().includes(filters.user.toLowerCase()) &&
      call.expertName.toLowerCase().includes(filters.expert.toLowerCase()) &&
      call.status.toLowerCase().includes(filters.status.toLowerCase())
    );
  });

  // Sorting the filtered calls based on sortConfig state
  if (sortConfig.key) {
    lastFiveCalls.sort((a, b) => {
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
    <table className="last-five-calls-table">
      <thead>
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
          <th onClick={() => handleSort('status')}>
            Status {renderSortArrow('status')}
          </th>
          <th onClick={() => handleSort('ConversationScore')}>
            Score {renderSortArrow('ConversationScore')}
          </th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        {lastFiveCalls.map((call) => (
          <tr key={call._id} className={getStatusColor(call.status)}>
            <td>{call.userName}</td>
            <td>{call.expertName}</td>
            <td>{new Date(call.initiatedTime).toLocaleString()}</td>
            <td>{call.duration} min</td>
            <td>{call.status}</td>
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
  );
};

export default LastFiveCallsTable;
