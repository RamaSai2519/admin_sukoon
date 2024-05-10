import React from 'react';
import { useData } from '../../../../services/useData';
import './toggle.css'

const ErrorLogsComponent = () => {
    const { errorLogs } = useData();

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