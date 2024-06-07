import React from "react";
import ExpertsList from "../../components/ExpertsList";
import LazyLoad from "../../components/LazyLoad/lazyload";

const SaarthisTab = () => {
  return (
    <LazyLoad>
      <div className="w-full overflow-auto">
        <ExpertsList />
      </div>
    </LazyLoad>
  );
};

export default SaarthisTab;