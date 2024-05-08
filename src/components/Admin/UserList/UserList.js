import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollBottom from '../AdminDashboard/ScrollBottom';
import './UserList.css';
import useUserManagement from '../../../services/useUserManagement';

const UsersList = () => {
  const { users } = useUserManagement();
  const [filters, setFilters] = useState({
    user: '',
    city: '',
    phoneNumber: ''
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

  let filteredUsers = users.filter((user) => {
    return (
      (user.name && user.name.toLowerCase().includes(filters.user.toLowerCase())) &&
      (user.city && user.city.toLowerCase().includes(filters.city.toLowerCase())) &&
      (user.phoneNumber && user.phoneNumber.toLowerCase().includes(filters.phoneNumber.toLowerCase()))
    );
  });

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

  const renderSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return null;
  };

  return (
    <div className="table-container">
      <div className="dashboard-tile">
        <div className='latest-wrapper'>
          <table className="users-table">
            <thead>
              <tr className="filter-row">
                <td>
                  <input
                    type="text"
                    placeholder="Search User"
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
                    placeholder="Filter Phone Number"
                    name="phoneNumber"
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
                <th onClick={() => handleSort('phoneNumber')}>
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
                  <td>{user.phoneNumber}</td>
                  <td>{new Date(user.createdDate).toLocaleDateString()}</td>
                  <td>{user.numberOfCalls}</td>
                  <td>
                    <Link to={`/admin/users/${user._id}`} className="view-details-link">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ScrollBottom />
          <Link to="/admin/experts" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 className="experts-button">View All Experts</h1>
          </Link>
          <Link to="/admin/calls" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 className="calls-button">View All Calls</h1>
          </Link>
          <Link to="/admin/users" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 className="users-button">View All Users</h1>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UsersList;