import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { red, green } from '@mui/material/colors';

const renderStatusIcon = (saarthi) => {
  if (saarthi.isBusy === false) {
    return <PersonIcon sx={{ color: green[500] }} />;
  } else {
    return <PersonOffIcon sx={{ color: red[500] }} />;
  }
}

const OnlineSaarthisTable = ({ onlineSaarthis }) => {
  // Sort the saarthis array by isBusy is false first
  const sortedSaarthis = onlineSaarthis.sort((a, b) => {
    if (a.isBusy === true && b.isBusy === false) {
      return -1;
    } else if (a.isBusy === false && b.isBusy === true) {
      return 1;
    } else {
      return 0;
    }
  });

  return (
    <div className="w-full h-32 overflow-auto">
      <table className="w-full mt-2">
        <thead>
        </thead>
        <tbody>
          {sortedSaarthis.map(saarthi => (
            <tr key={saarthi._id}>
              <td>{saarthi.name}</td>
              <td className='text-right'>{renderStatusIcon(saarthi)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OnlineSaarthisTable;
