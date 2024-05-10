import React, { useState } from 'react';
import { Table, ConfigProvider, theme } from 'antd';

const Popup = ({ title, users, onClose }) => {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Date Joined",
      dataIndex: "createdDate",
      key: "date",
      render: (createdDate) => new Date(createdDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
    },
    {
      title: "Date of Birth",
      dataIndex: "birthDate",
      key: "birthDate",
      render: (createdDate) => new Date(createdDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
    },
  ];

  return (

    <ConfigProvider theme={
      {
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }
    }>
      <div className="popup">
        <div className="popup-content">
          <div className="popup-header">
            <h2>{title}</h2>
            <button className="close-btn" onClick={onClose}>Close</button>
          </div>
          <div>
            {users.length > 0 ? (
              <Table dataSource={users.reverse()} columns={columns} />
            ) : (
              <p>No users to display</p>
            )}
          </div>
        </div>
      </div>
    </ConfigProvider>

  );
};

export default Popup;
