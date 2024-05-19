import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";

const NavMenu = () => {
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleViewExpertsClick = () => {
        localStorage.setItem('adminActiveTab', 'onlineSaarthis');
        navigate('/admin/dashboard');
    };

    return (
        <div>
            <div className="fixed bottom-2 right-2 dark:bg-lightBlack p-4 rounded-full text-2xl no-underline cshadow hover:scale-110 transition-all" onClick={toggleMenu}>
                <FaBars />
            </div>
            {showMenu && (
                <div
                    style={{ alignItems: "flex-end" }}
                    className="fixed right-2 z-10 bottom-20 text-right flex flex-col gap-2">

                    <h1
                        className="dark:bg-lightBlack p-2 w-fit cursor-pointer rounded-full hover:scale-110 transition-all text-lg no-underline shadow-md"
                        onClick={handleViewExpertsClick}
                    >
                        View All Experts
                    </h1>

                    <Link
                        to="/admin/calls"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <h1 className="dark:bg-lightBlack p-2 w-fit rounded-full hover:scale-110 transition-all text-lg no-underline">View All Calls</h1>
                    </Link>
                    <Link
                        to="/admin/users"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <h1 className="dark:bg-lightBlack p-2 w-fit rounded-full hover:scale-110 transition-all text-lg no-underline">View All Users</h1>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default NavMenu;
