import React from "react";
import { Switch } from "antd";

const InternalToggle = ({ internalView, setInternalView, disable }) => {
    const handleViewChange = () => {
        setInternalView(!internalView);
        localStorage.setItem('internalView', !internalView);
    };

    return <Switch
        disabled={disable}
        unCheckedChildren="Users Data"
        checkedChildren="Internal Data"
        checked={internalView} onChange={handleViewChange}
    />;
};

export default InternalToggle;