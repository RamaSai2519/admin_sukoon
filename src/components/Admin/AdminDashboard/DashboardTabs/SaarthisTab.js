import React, { useState, useEffect } from "react";
import ExpertTotalList from "./ExpertTotalList";
import ExpertDayList from "./ExpertDayList";

const SaarthisTab = () => {
  const [selectedOption, setSelectedOption] = useState(() => {
    return localStorage.getItem("selectedOption") || "all";
  });

  useEffect(() => {
    localStorage.setItem("selectedOption", selectedOption);
  }, [selectedOption]);

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="saarthis-tab">
      <div className='idk' style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1 className="experts-heading">Experts</h1>
        <div className='drop-down'>
          <label>
            <select value={selectedOption} onChange={handleChange}>
              <option value="day">Day</option>
              <option value="all">All</option>
            </select>
          </label>
        </div>
      </div>
      {selectedOption === "all" ? <ExpertTotalList /> : <ExpertDayList />}
    </div>
  );
};

export default SaarthisTab;