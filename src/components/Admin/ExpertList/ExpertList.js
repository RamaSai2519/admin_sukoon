import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useExpertManagement from '../../../services/useExpertManagement';
import * as XLSX from 'xlsx';

const ExpertList = () => {
  const { experts } = useExpertManagement();
  const [sortConfig, setSortConfig] = useState({
    key: 'createdDate',
    direction: 'descending',
  });

  useEffect(() => {
  }, []);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  experts.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const renderSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return null;
  };

  const downloadExcel = () => {
    const wb = XLSX.utils.book_new(); // Create a new Excel Workbook
    const wsData = [
      ['Name', 'Number', 'Joined Date', 'C.Score', 'Share', 'Reapeat %', 'T.Score'] // Header row
    ];
    experts.forEach((expert) => {
      wsData.push([
        expert.name,
        expert.phoneNumber,
        expert.createdDate,
        expert.score,
        expert.callsShare,
        expert.repeatRate,
        expert.totalScore
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData); // Convert array of arrays to worksheet
    XLSX.utils.book_append_sheet(wb, ws, 'Expert_Data'); // Append worksheet to workbook

    XLSX.writeFile(wb, 'ExpertList.xlsx');
  };

  return (
    <div className="table-container">
      <div className="dashboard-tile">
        <div className='latest-wrapper'>
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
                    <Link to={`/admin/experts/${expert._id}`} className="view-details-link">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        <button className='popup-button' onClick={downloadExcel}>Export Excel Sheet</button>
      </div>
    </div>
  );
};

export default ExpertList;
