import React from "react";
import ExpertsList from "../../components/ExpertsList";
import NavMenu from "../../components/NavMenu/NavMenu";
import LazyLoad from "../../components/LazyLoad/lazyload";

const SaarthisTab = () => {
  return (
    <LazyLoad>
      <div className="w-full overflow-auto">
        <ExpertsList />
        <NavMenu />
      </div>
    </LazyLoad>
  );
};

export default SaarthisTab;