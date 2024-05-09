import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";

const NavMenu = () => {
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <div>
            <div className="menu-button" onClick={toggleMenu}>
                <FaBars />
            </div>
            {showMenu && (
                <div className="menu-links">
                    <Link
                        to="/admin/experts"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <h1 className="experts-button">View All Experts</h1>
                    </Link>
                    <Link
                        to="/admin/calls"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <h1 className="calls-button">View All Calls</h1>
                    </Link>
                    <Link
                        to="/admin/users"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <h1 className="users-button">View All Users</h1>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default NavMenu;
