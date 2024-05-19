import React from "react";
import ExpertsList from "../../ExpertsList/ExpertsList";
import NavMenu from "../../../NavMenu/NavMenu";

const SaarthisTab = () => {
  return (
    <div className="container">
      <div className="w-full">
        <ExpertsList />
      </div>
      <NavMenu />
    </div>
  );
};

export default SaarthisTab;