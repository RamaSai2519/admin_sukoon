import React from 'react';
import { Table } from 'antd';
import { formatDate } from '../../../Utils/formatHelper';

const Popup = ({ title, users, onClose }) => {
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
      render: (createdDate) => formatDate(createdDate),
    },
    {
      title: "Date of Birth",
      dataIndex: "birthDate",
      key: "birthDate",
      render: (createdDate) => formatDate(createdDate),
    },
  ];

  return (
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
  );
};

export default Popup;
