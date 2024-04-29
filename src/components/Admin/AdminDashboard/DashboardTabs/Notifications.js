import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ErrorLogsComponent = () => {
    const [errorLogs, setErrorLogs] = useState([]);
    // Retrieve darkMode from localStorage or default to the device theme
    const [darkMode, setDarkMode] = useState(() => {
        const localStorageDarkMode = localStorage.getItem('darkMode');
        // Check if dark mode is explicitly set in localStorage
        if (localStorageDarkMode !== null) {
            return JSON.parse(localStorageDarkMode);
        } else {
            // Otherwise, use the device theme
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
    });

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        // Store darkMode in localStorage
        localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
        window.location.reload();
    };

    useEffect(() => {
        const fetchErrorLogs = async () => {
            try {
                const response = await axios.get('http://15.206.127.248/api/errorlogs');
                setErrorLogs(response.data.reverse());
            } catch (error) {
                console.error('Error fetching error logs:', error);
            }
        };

        fetchErrorLogs();
    }, []);

    return (
        <div className="dashboard-tiles">
            <div className='dashboard-tile'>
                <ul style={{ margin: '0', padding: '0', 'list-style-type': 'none' }}>
                    {errorLogs.map((log, index) => (
                        <div className="grid-tile-1">
                            <li key={index} style={{ padding: '10px' }}>
                                <strong>Time:</strong> {log.time} <br /><br /> <strong></strong> {log.message}
                            </li>
                        </div>
                    ))}
                </ul>
            </div>
            <div className='uwrapper'>
                <div className='wrapper-wrapper'>
                    <div className='toggleWrapper'>
                        <input type="checkbox" className="dn" id="dn" checked={darkMode} onChange={toggleDarkMode} />
                        <label htmlFor="dn" className="toggle">
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
            </div>
        </div>
    );
};

export default ErrorLogsComponent;