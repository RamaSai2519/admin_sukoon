import React, { useState, useEffect } from "react";
import ExpertTotalList from "./ExpertTotalList";
import ExpertDayList from "./ExpertDayList";
import NavMenu from "../../../NavMenu/NavMenu";

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
      <div className="dashboard-tiles">
        <div className="dashboard-tile">
          <div className="latest-wrapper">
            <div className='idk' style={{ display: 'flex', padding: '0 20px', justifyContent: 'space-between', maxWidth: '1200px', margin: "0 auto" }}>
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
        </div>
      </div>
      <NavMenu />
    </div>
  );
};

export default SaarthisTab;