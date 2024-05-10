import React, { useState, useEffect } from 'react';
import Raxios from '../../../../services/axiosHelper';
import './toggle.css'

const ErrorLogsComponent = () => {
    const [errorLogs, setErrorLogs] = useState([]);

    useEffect(() => {
        const fetchErrorLogs = async () => {
            try {
                const response = await Raxios.get('/api/errorlogs');
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
                                <strong>Time:</strong> {new Date(log.time).toLocaleString()} <br /><br /> <strong></strong> {log.message}
                            </li>
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ErrorLogsComponent;