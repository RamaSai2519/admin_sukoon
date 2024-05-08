// components/Admin/AdminDashboard/Popup.js
import React from 'react';
import { Table } from 'antd';

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
    },
  ];
  
  return (
    <div className="popup">
      <div className="popup-content">
        <div className="popup-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
        <div>
          {users.length > 0 ? (
            // <ul className="popup-body" style={{listStyle: "none"}}>
            //   {users.map(user => (
            //     <li key={user._id}>
            //       {user.name}
            //     </li>
            //   ))}
            // </ul>
            <Table dataSource={users.reverse()} columns={columns}/>
          ) : (
            <p>No users to display</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
