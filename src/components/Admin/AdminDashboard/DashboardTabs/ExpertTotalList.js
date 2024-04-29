import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useCallsData from '../../../../services/useCallsData';
import useExpertManagement from '../../../../services/useExpertManagement';

const ExpertTotalList = () => {
    const { experts } = useExpertManagement();
    const { calls } = useCallsData();
    const [sortConfig, setSortConfig] = useState({
        key: '',
        direction: ''
    });

    useEffect(() => {
    }, []);

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
                    {experts.map((expert) => {
                        const expertCalls = calls.filter(call => call.expert === expert._id);
                        const successfulCalls = expertCalls.filter(call => call.status === 'successful').length;
                        const failedCalls = expertCalls.filter(call => call.status !== 'successful').length;
                        const avgCallsPerDay = calculateAvgCallsPerDay(expertCalls);
                        return (
                            <tr key={expert._id} className="row">
                                <td>{expert.name}</td>
                                <td>{successfulCalls}</td>
                                <td>{failedCalls}</td>
                                <td>{avgCallsPerDay.toFixed(2)}</td>
                                <td>{expert.score}</td>
                                <td>{expert.status}</td>
                                <td>
                                    <Link to={`/experts/${expert._id}`} className="view-details-link">
                                        View
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
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