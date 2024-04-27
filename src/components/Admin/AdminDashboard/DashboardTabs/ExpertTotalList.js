import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ExpertTotalList = () => {
    const [experts, setExperts] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        key: '',
        direction: ''
    });

    useEffect(() => {
        fetchAllExperts();
    }, []);

    const fetchAllExperts = async () => {
        try {
            const expertsResponse = await axios.get('/api/experts');
            const callsResponse = await axios.get('/api/all-calls');

            const expertsData = expertsResponse.data;
            const callsData = callsResponse.data;

            // Calculate successful and failed calls for each expert
            const expertsWithCallsData = expertsData.map(expert => {
                const expertCalls = callsData.filter(call => call.expert === expert._id);
                const successfulCalls = expertCalls.filter(call => call.status === 'successfull').length;
                const failedCalls = expertCalls.filter(call => call.status !== 'successfull').length;
                // Calculate average calls per day
                const avgCallsPerDay = calculateAvgCallsPerDay(expertCalls);
                return { ...expert, successfulCalls, failedCalls, avgCallsPerDay };
            });

            setExperts(expertsWithCallsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    if (sortConfig.key) {
        experts.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }

    const renderSortArrow = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
        }
        return null;
    };

    const calculateAvgCallsPerDay = (callsData) => {
        if (callsData.length === 0) return 0;

        const totalCalls = callsData.length;

        const uniqueDaysSpoken = new Set(callsData.map(call => {
            const callDate = new Date(call.initiatedTime);
            return callDate.toISOString().split('T')[0];
        }));
        const avgCallsPerDay = totalCalls / uniqueDaysSpoken.size;

        return avgCallsPerDay;
    };


    return (
        <div className="table-container">
            <table className="users-table">
                <thead>
                    <tr>
                        <th onClick={() => handleSort('name')}>
                            Expert {renderSortArrow('name')}
                        </th>
                        <th onClick={() => handleSort('successfulCalls')}>
                            Successful Calls {renderSortArrow('successfulCalls')}
                        </th>
                        <th onClick={() => handleSort('failedCalls')}>
                            Failed Calls {renderSortArrow('failedCalls')}
                        </th>
                        <th onClick={() => handleSort('avgCallsPerDay')}>
                            Avg Calls/Day {renderSortArrow('avgCallsPerDay')}
                        </th>
                        <th onClick={() => handleSort('score')}>
                            Score {renderSortArrow('score')}
                        </th>
                        <th>Status</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {experts.map((expert) => (
                        <tr key={expert._id} className="row">
                            <td>{expert.name}</td>
                            <td>{expert.successfulCalls}</td>
                            <td>{expert.failedCalls}</td>
                            <td>{expert.avgCallsPerDay.toFixed(2)}</td>
                            <td>{expert.score}</td>
                            <td>{expert.status}</td>
                            <td>
                                <Link to={`/experts/${expert._id}`} className="view-details-link">
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/calls" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h1 className="calls-button">View All Calls</h1>
            </Link>
            <Link to="/users" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h1 className="users-button">View All Users</h1>
            </Link>
        </div>
    );
};

export default ExpertTotalList;
