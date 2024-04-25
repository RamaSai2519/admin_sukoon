import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ScrollBottom from '../AdminDashboard/ScrollBottom';
import './CallList.css';

const CallsTable = () => {
  const [Calls, setCalls] = useState([]);
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
    fetchAllCalls();
  }, []);

  const fetchAllCalls = async () => {
    try {
      const response = await axios.get('https://admin-server-virid.vercel.app/api/all-calls');
      setCalls(response.data.reverse());
    } catch (error) {
      console.error('Error fetching all calls:', error);
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

  // Filter the calls based on the filters state
  let filteredCalls = Calls.filter((call) => {
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
            <td>
              <input
                type="text"
                placeholder="Filter Status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              />
            </td>
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
            <th onClick={() => handleSort('status')}>
              Status {renderSortArrow('status')}
            </th>
            <th>Details</th>
          </tr>

        </thead>
        <tbody>
          {filteredCalls.map((call) => (
            <tr key={call._id} className={getStatusColor(call.status)}>
              <td>{call.userName}</td>
              <td>{call.expertName}</td>
              <td>{new Date(call.initiatedTime).toLocaleString()}</td>
              <td>{call.duration} min</td>
              <td style={{textAlign: 'center'}}>{call.status}</td>
              <td>
                <Link to={`/calls/${call.callId}`} className="view-details-link">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ScrollBottom />
    </div>
  );
};

export default CallsTable;