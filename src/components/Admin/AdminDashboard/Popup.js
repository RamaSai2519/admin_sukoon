// components/Admin/AdminDashboard/Popup.js
import React from 'react';

const Popup = ({ title, users, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <div className="popup-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
        <div className="popup-body">
          <ul>
            {users.map((userId, index) => (
              <li key={index}>{userId}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Popup;