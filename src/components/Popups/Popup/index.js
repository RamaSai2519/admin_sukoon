import React from 'react';
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
      <div className="fixed left-0 top-0 overflow-auto w-full h-full bg-black bg-opacity-50 ">
        <div className="p-10 rounded-5 rounded-10 shadow-md min-w-1/2 max-w-90 max-h-90 overflow-y-auto relative">
          <div className='w-fit mx-auto h-auto'>
            <div className="flex flex-row m-5 justify-end">
              <button className="pback-button" onClick={onClose}>X</button>
            </div>
            {users.length > 0 ? (
              <Table dataSource={users.reverse()} columns={columns} rowKey={(user) => user._id} />
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
