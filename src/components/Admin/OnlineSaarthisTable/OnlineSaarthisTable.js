// OnlineSaarthisTable.js
import React from 'react';
import './OnlineSaarthisTable.css';

const OnlineSaarthisTable = ({ onlineSaarthis }) => {
  return (
    <div className="online-table-container">
      <table className="online-table">
        <thead>
        </thead>
        <tbody>
          {onlineSaarthis.map(saarthi => (
            <tr key={saarthi._id}>
              <td>{saarthi.name}</td>
              <td className='status'>{saarthi.isBusy ? 'Busy' : 'Free'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OnlineSaarthisTable;
