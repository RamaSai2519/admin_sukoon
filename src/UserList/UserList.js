import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollBottom from '../AdminDashboard/ScrollBottom';
import { useUsers } from '../services/useData';
import writeXlsxFile from 'write-excel-file';
import { saveAs } from 'file-saver';
import NavMenu from '../components/NavMenu/NavMenu';
import './UserList.css';

const UsersList = () => {
  const { users, fetchUsers } = useUsers();
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

  const downloadExcel = async () => {
    const wsData = [
      [
        { value: 'Name' },
        { value: 'City' },
        { value: 'Number' },
        { value: 'Joined Date' },
        { value: 'Birth Date' }
      ]
    ];
    users.forEach((user) => {
      wsData.push([
        { value: user.name },
        { value: user.city },
        { value: user.phoneNumber },
        { value: new Date(user.createdDate).toLocaleDateString() },
        { value: new Date(user.birthDate).toLocaleDateString() }
      ]);
    });
    const buffer = await writeXlsxFile(wsData, {
      headerStyle: {
        fontWeight: 'bold'
      },
      buffer: true
    });
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'UserList.xlsx');
  };


  React.useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container min-h-screen w-full overflow-auto">
      <table className="users-table mt-5">
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
            <td>
              <button className='popup-button' onClick={downloadExcel}>
                Export
              </button>
            </td>
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
            <th onClick={() => handleSort('birthDate')}>
              DOB {renderSortArrow('birthDate')}
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
              <td>{new Date(user.birthDate).toLocaleDateString()}</td>
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
      <NavMenu />
    </div>
  );
};

export default UsersList;