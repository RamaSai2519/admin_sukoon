import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ExpertList = () => {
  const [experts, setExperts] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: ''
  });

  useEffect(() => {
    fetchAllExperts();
  }, []);

  const fetchAllExperts = async () => {
    try {
      const response = await axios.get('/api/experts');
      setExperts(response.data);
    } catch (error) {
      console.error('Error fetching all experts:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (sortConfig.key) {
    experts.sort((a, b) => {
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
      <table className="users-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>
              Expert {renderSortArrow('name')}
            </th>
            <th onClick={() => handleSort('phoneNumber')}>
              Number {renderSortArrow('phoneNumber')}
            </th>
            <th onClick={() => handleSort('score')}>
              Score {renderSortArrow('score')}
            </th>
            <th onClick={() => handleSort('status')}>
              Status {renderSortArrow('status')}
            </th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {experts.map((expert) => (
            <tr key={expert._id} className="row">
              <td>{expert.name}</td>
              <td>{expert.phoneNumber}</td>
              <td>{expert.score}</td>
              <td>{expert.status}</td>
              <td>
                <Link to={`/experts/${expert._id}`} className="view-details-link">
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
    </div>
  );
};

export default ExpertList;