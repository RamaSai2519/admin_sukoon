import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollBottom from '../AdminDashboard/ScrollBottom';
import './CallList.css';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMissedIcon from '@mui/icons-material/CallMissed';
import { useCalls } from '../services/useData';
import { red, pink, green, yellow } from '@mui/material/colors';
import writeXlsxFile from 'write-excel-file';
import { saveAs } from 'file-saver';
import LazyLoad from '../components/LazyLoad/lazyload';

const CallsTable = () => {
  const { calls } = useCalls();
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

  const downloadExcel = async () => {
    const wsData = [
      [
        { value: 'User' },
        { value: 'Expert' },
        { value: 'Time' },
        { value: 'Duration' },
        { value: 'Status' },
        { value: 'Score' }
      ]
    ];

    calls.forEach((call) => {
      wsData.push([
        { value: call.userName },
        { value: call.expertName },
        { value: new Date(call.initiatedTime).toLocaleString() },
        { value: `${call.duration} min` },
        { value: call.status },
        { value: call.ConversationScore }
      ]);
    });

    const buffer = await writeXlsxFile(wsData, {
      headerStyle: {
        fontWeight: 'bold'
      },
      buffer: true
    });

    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'calls.xlsx');
  };

  return (
    <LazyLoad>
      <div className="w-full overflow-auto">
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
                  <td>
                    <button className='popup-button' onClick={downloadExcel}>
                      Export
                    </button>
                  </td>
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
            <ScrollBottom />
          </div>
        </div>
      </div>
    </LazyLoad>
  );
};

export default CallsTable;