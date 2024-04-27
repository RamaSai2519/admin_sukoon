import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ScrollBottom from '../AdminDashboard/ScrollBottom';
import './UserList.css'

const UsersList = () => {
  const [Users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    user: '',
    city: '',
    phoneNumber: '',
  });
  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: '',
  });

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data.reverse());
    } catch (error) {
      console.error('Error fetching all Users:', error);
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

  // Filter the Users based on the filters state
  let filteredUsers = Users.filter((user) => {
    return (
      user.name.toLowerCase().includes(filters.user.toLowerCase()) &&
      user.city.toLowerCase().includes(filters.city.toLowerCase()) &&
      user.phoneNumber.toLowerCase().includes(filters.phoneNumber.toLowerCase())
    );
  });

  // Sorting the filtered Users based on sortConfig state
  if (sortConfig.key) {
    filteredUsers.sort((a, b) => {
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
      <table className="users-table">
        <thead>
          <tr className="filter-row">
            <td>
              <input
                type="text"
                placeholder="Filter User"
                name="user"
                value={filters.name}
                onChange={handleFilterChange}
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Filter City"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Filter Number"
                name="number"
                value={filters.phoneNumber}
                onChange={handleFilterChange}
              />
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <th onClick={() => handleSort('name')}>
              User {renderSortArrow('name')}
            </th>
            <th onClick={() => handleSort('city')}>
              City {renderSortArrow('city')}
            </th>
            <th style={{ textAlign: 'center' }} onClick={() => handleSort('phoneNumber')}>
              Number {renderSortArrow('phoneNumber')}
            </th>
            <th onClick={() => handleSort('createdDate')}>
              Joined Date {renderSortArrow('createdDate')}
            </th>
            <th onClick={() => handleSort('numberOfCalls')}>
              Balance {renderSortArrow('numberOfCalls')}
            </th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id} className="row">
              <td>{user.name}</td>
              <td>{user.city}</td>
              <td style={{ textAlign: 'center' }}>{user.phoneNumber}</td>
              <td>{new Date(user.createdDate).toLocaleDateString()}</td>
              <td>{user.numberOfCalls}</td>
              <td>
                <Link to={`/users/${user._id}`} className="view-details-link">
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

export default UsersList;