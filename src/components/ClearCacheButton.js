// ClearCacheButton.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

const ClearCacheButton = () => {
  const handleClearCache = () => {
    const confirmation = window.confirm(
      "Are you sure you want to refresh all data?"
    );
    if (confirmation) {
      localStorage.removeItem('users');
      localStorage.removeItem('experts');
      localStorage.removeItem('calls');
      window.location.reload();
    }
  };

  return (
    <button className="clear-cache-button" onClick={handleClearCache}>
      <FontAwesomeIcon icon={faSyncAlt} />
    </button>
  );
};

export default ClearCacheButton;