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
          {users.length > 0 ? (
            <ul>
              {users.map(user => (
                <li key={user._id}>{user.name}</li>
              ))}
            </ul>
          ) : (
            <p>No users to display</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
