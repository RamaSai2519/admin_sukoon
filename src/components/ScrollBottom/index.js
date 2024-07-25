// components/Admin/AdminDashboard/ScrollBottom.js
import React, { useState, useEffect } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

const ScrollBottom = () => {
    const [showUpArrow, setShowUpArrow] = useState(false);

    const handleScroll = () => {
        const scrollTop = document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const scrollHeight = document.documentElement.scrollHeight;

        if (scrollTop > windowHeight / 2) {
            setShowUpArrow(true);
        } else {
            setShowUpArrow(false);
        }

        if (scrollTop + windowHeight >= scrollHeight) {
            setShowUpArrow(true);
        } else {
            setShowUpArrow(false);
        }
    };

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleScrollToBottom = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="fixed right-2 bottom-20 dark:bg-lightBlack p-2 rounded-full text-4xl cursor-pointer shadow-md hover:scale-110 transition-all" onClick={showUpArrow ? handleScrollToTop : handleScrollToBottom}>
            {showUpArrow ? <FaArrowUp /> : <FaArrowDown />}
        </div>
    );
};

export default ScrollBottom;