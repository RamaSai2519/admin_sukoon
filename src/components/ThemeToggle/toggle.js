import React from 'react';
import { useDarkMode } from '../../contexts/useDarkMode';
import './toggle.css';

const ThemeToggle = () => {
    const { darkMode, setDarkMode } = useDarkMode();

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem('darkMode', !darkMode);
    };

    return (
        <div className='h-full'>
            <div className='flex items-center p-2 px-1 my-2'>
                <input type="checkbox" className="absolute ml-2" id="dn" checked={darkMode} onChange={toggleDarkMode} />
                <label htmlFor="dn" className="toggle" onClick={toggleDarkMode}>
                    <span className="toggle__handler">
                        <span className="crater crater--1"></span>
                        <span className="crater crater--2"></span>
                        <span className="crater crater--3"></span>
                    </span>
                    <span className="star star--1"></span>
                    <span className="star star--2"></span>
                    <span className="star star--3"></span>
                    <span className="star star--4"></span>
                    <span className="star star--5"></span>
                    <span className="star star--6"></span>
                </label>
            </div>
        </div>
    );
};

export default ThemeToggle;