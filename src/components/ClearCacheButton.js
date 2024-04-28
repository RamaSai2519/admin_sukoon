// ClearCacheButton.js
import React from 'react';

const ClearCacheButton = () => {
  const handleClearCache = () => {
    const confirmation = window.confirm(
      "Are you sure you want to clear all cached data? This will log you out."
    );
    if (confirmation) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <button className="clear-cache-button" onClick={handleClearCache}>
      .
    </button>
  );
};

export default ClearCacheButton;