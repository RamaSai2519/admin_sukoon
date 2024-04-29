import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useCallsData from '../../../../services/useCallsData';
import useExpertManagement from '../../../../services/useExpertManagement';
import * as XLSX from 'xlsx';

const ExpertTotalList = () => {
    const { experts } = useExpertManagement();
    const { calls } = useCallsData();
    const [sortConfig, setSortConfig] = useState({
        key: 'createdDate',
        direction: 'descending'
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

    const downloadExcel = () => {
        const wb = XLSX.utils.book_new(); // Create a new Excel Workbook
        const wsData = [
            ['Expert', 'Successful', 'Failed', 'Avg.', 'C.Score', 'Share', 'Repeat %', 'T.Score', 'Status'] // Header row
        ];
        experts.forEach((expert) => {
            const expertCalls = calls.filter(call => call.expert === expert._id);
            const successfulCalls = expertCalls.filter(call => call.status === 'successful').length;
            const failedCalls = expertCalls.filter(call => call.status !== 'successful').length;
            const avgCallsPerDay = calculateAvgCallsPerDay(expertCalls);
            wsData.push([
                expert.name,
                successfulCalls,
                failedCalls,
                avgCallsPerDay.toFixed(2),
                expert.score * 20,
                expert.callsShare + '%',
                expert.repeatRate + '%',
                expert.totalScore,
                expert.status
            ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData); // Convert array of arrays to worksheet
        XLSX.utils.book_append_sheet(wb, ws, 'Expert_Data'); // Append worksheet to workbook

        // Save the workbook as an Excel file
        XLSX.writeFile(wb, 'ExpertTotalLists.xlsx');
    };

    return (
        <div className="table-container">
            <table className="users-table">
                <thead>
                    <tr>
                        <th onClick={() => handleSort('name')}>
                            Expert{renderSortArrow('name')}
                        </th>
                        <th onClick={() => handleSort('successfulCalls')}>
                            Successful{renderSortArrow('successfulCalls')}
                        </th>
                        <th onClick={() => handleSort('failedCalls')}>
                            Failed{renderSortArrow('failedCalls')}
                        </th>
                        <th onClick={() => handleSort('avgCallsPerDay')}>
                            Avg.{renderSortArrow('avgCallsPerDay')}
                        </th>
                        <th onClick={() => handleSort('score')}>
                            C.Score{renderSortArrow('score')}
                        </th>
                        
                        <th onClick={() => handleSort('callsShare')}>
                            Share{renderSortArrow('callsShare')}
                        </th>
                        <th onClick={() => handleSort('repeatRate')}>
                            Repeat %{renderSortArrow('repeatRate')}
                        </th>
                        <th onClick={() => handleSort('totalScore')}>
                            T.Score{renderSortArrow('totalScore')}
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
                                <td>{expert.score*20}</td>
                                <td>{expert.callsShare}%</td>
                                <td>{expert.repeatRate}%</td>
                                <td>{expert.totalScore}</td>
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
            <button className='popup-button' onClick={downloadExcel}>Export Excel Sheet</button>
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