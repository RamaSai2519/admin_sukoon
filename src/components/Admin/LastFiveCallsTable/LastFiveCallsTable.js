import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMissedIcon from '@mui/icons-material/CallMissed';
import { red, pink, green, yellow } from '@mui/material/colors';
import './LastFiveCallsTable.css';
import useCallsData from '../../../services/useCallsData';

const LastFiveCallsTable = () => {
  const { calls } = useCallsData();
  const [lastFiveCalls, setLastFiveCalls] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: '',
  });

  useEffect(() => {
    const todayCalls = calls.filter(call => {
      const callDate = new Date(call.initiatedTime);
      const today = new Date();
      return (
        callDate.getDate() === today.getDate() &&
        callDate.getMonth() === today.getMonth() &&
        callDate.getFullYear() === today.getFullYear()
      );
    });

    if (todayCalls.length > 0) {
      setLastFiveCalls(todayCalls);
    } else {
      setLastFiveCalls(calls.slice(0, 5));
    }
  }, [calls]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

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

  const renderSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return null;
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
          <tr key={call.callId} className='default-row'>
            <td>{renderStatusIcon(call.status)} {call.userName}</td>
            <td>{call.expertName}</td>
            <td>{new Date(call.initiatedTime).toLocaleString()}</td>
            <td>{call.duration} min</td>
            <td>{call.status}</td>
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
  );
};

export default LastFiveCallsTable;