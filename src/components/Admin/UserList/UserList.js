import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ScrollBottom from '../AdminDashboard/ScrollBottom';
import './UserList.css'

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    user: '',
    city: '',
  });
  const [sortConfig, setSortConfig] = useState({
    key: '',
    direction: '',
  });

  useEffect(() => {
    const cachedUsers = JSON.parse(localStorage.getItem('users'));
    if (cachedUsers) {
      setUsers(cachedUsers);
      fetchNewUsers(cachedUsers);
    } else {
      fetchAllUsers();
    }
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      setUsers(response.data.reverse());
      localStorage.setItem('users', JSON.stringify(response.data.reverse()));
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  };

  const fetchNewUsers = async (cachedUsers) => {
    const latestTimestamp = cachedUsers.length > 0 ? cachedUsers[0].createdDate : 0;
    try {
      const response = await axios.get(`/api/new-users?timestamp=${latestTimestamp}`);
      const newData = response.data;

      if (newData.length > 0) {
        // Sort the merged data in descending order by createdDate
        const mergedData = [...newData, ...users].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        setUsers(mergedData);
        localStorage.setItem('users', JSON.stringify(mergedData));
        console.log('New users fetched');
      }
    } catch (error) {
      console.error('Error fetching new users:', error);
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
  let filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(filters.user.toLowerCase()) &&
      user.city.toLowerCase().includes(filters.city.toLowerCase())
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
            <td></td>
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
          {filteredUsers.reverse().map((user) => (
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

export default UsersList;