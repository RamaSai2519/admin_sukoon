import React from "react";
import ExpertsList from "../../components/ExpertsList/ExpertsList";
import NavMenu from "../../components/NavMenu/NavMenu";

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