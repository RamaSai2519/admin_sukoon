// components/Admin/AdminDashboard/ScrollToBottomButton.js
import React, { useState, useEffect } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

const ScrollToBottomButton = () => {
    const [showUpArrow, setShowUpArrow] = useState(false);

    const handleScroll = () => {
        const scrollTop = document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const scrollHeight = document.documentElement.scrollHeight;

        // Check if user has scrolled past half the window height
        if (scrollTop > windowHeight / 2) {
            setShowUpArrow(true);
        } else {
            setShowUpArrow(false);
        }

        // Check if user has scrolled to the bottom
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
        <div className="scroll-to-bottom-button" onClick={showUpArrow ? handleScrollToTop : handleScrollToBottom}>
            {showUpArrow ? <FaArrowUp /> : <FaArrowDown />}
        </div>
    );
};

export default ScrollToBottomButton;