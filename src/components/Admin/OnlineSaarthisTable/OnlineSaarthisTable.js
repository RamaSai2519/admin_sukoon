// OnlineSaarthisTable.js
import React from 'react';
import './OnlineSaarthisTable.css';
import PersonIcon from '@mui/icons-material/Person';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { red, green } from '@mui/material/colors';

const renderStatusIcon = (saarthi) => {
  console.log(saarthi);
  if (saarthi.isBusy) {
    return <PersonOffIcon sx={{ color: red[500] }} />;
  } else {
    return <PersonIcon sx={{ color: green[500] }} />;
  }
}

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
              <td className='status'>{renderStatusIcon(saarthi)}</td>
              {/* <td className='status'>{saarthi.isBusy ? 'Busy' : 'Available'}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OnlineSaarthisTable;
