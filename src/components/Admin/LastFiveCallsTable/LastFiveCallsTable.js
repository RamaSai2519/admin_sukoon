import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LastFiveCallsTable.css'; // Import the CSS file

const LastFiveCallsTable = () => {
  const [lastFiveCalls, setLastFiveCalls] = useState([]);

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

  return (
    <table className="last-five-calls-table">
      <thead>
        <tr>
          <th>User</th>
          <th>Expert</th>
          <th>Time</th>
          <th>Call Duration</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {lastFiveCalls.map((call, index) => (
          <tr key={call._id} className={getStatusColor(call.status)}>
            <td>{call.userName}</td>
            <td>{call.expertName}</td>
            <td>{new Date(call.initiatedTime).toLocaleString()}</td>
            <td>{call.duration} min</td>
            <td>{call.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LastFiveCallsTable;
