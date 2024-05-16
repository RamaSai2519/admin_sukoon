import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../../../services/useData';
import * as XLSX from 'xlsx';

const ExpertTotalList = () => {
    const { experts, calls } = useData();
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

    const sortData = (data, key, direction) => {
        return [...data].sort((a, b) => {
            const valueA = calculateSortValue(a, key);
            const valueB = calculateSortValue(b, key);

            if (!isNaN(valueA) && !isNaN(valueB)) {
                return direction === 'ascending' ? valueA - valueB : valueB - valueA;
            } else {
                // Handle NaN values
                if (isNaN(valueA) && isNaN(valueB)) {
                    return 0;
                } else if (isNaN(valueA)) {
                    return direction === 'ascending' ? 1 : -1;
                } else {
                    return direction === 'ascending' ? -1 : 1;
                }
            }
        });
    };

    const calculateSortValue = (item, key) => {
        switch (key) {
            case 'successfulCalls':
                return calculateSuccessfulCalls(item);
            case 'failedCalls':
                return calculateFailedCalls(item);
            case 'avgCallsPerDay':
                return calculateAvgCallsPerDay(item);
            case 'missedCalls':
                return calculatemissedCalls(item);
            default:
                return item[key];
        }
    };

    const calculateSuccessfulCalls = (expert) => {
        const expertCalls = calls.filter(call => call.expert === expert._id);
        return expertCalls.filter(call => call.status === 'successful').length;
    };

    const calculateFailedCalls = (expert) => {
        const expertCalls = calls.filter(call => call.expert === expert._id);
        return expertCalls.filter(call => call.status === 'failed').length;
    };

    const calculatemissedCalls = (expert) => {
        const expertCalls = calls.filter(call => call.expert === expert._id);
        return expertCalls.filter(call => call.status === 'missed').length;
    };

    const calculateAvgCallsPerDay = (expert) => {
        const expertCalls = calls.filter(call => call.expert === expert._id);
        if (expertCalls.length === 0) return 0;

        const totalCalls = expertCalls.length;
        const uniqueDaysSpoken = new Set(expertCalls.map(call => {
            const callDate = new Date(call.initiatedTime);
            return callDate.toISOString().split('T')[0];
        }));
        const avgCallsPerDay = totalCalls / uniqueDaysSpoken.size;

        return avgCallsPerDay;
    };

    const downloadExcel = () => {
        const wb = XLSX.utils.book_new(); // Create a new Excel Workbook
        const wsData = [
            ['Expert', 'Successful', 'Failed', 'Missed', 'Avg.', 'C.Score', 'Share', 'Repeat %', 'T.Score', 'Status'] // Header row
        ];
        sortData(experts, sortConfig.key, sortConfig.direction).forEach((expert) => {
            const successfulCalls = calculateSuccessfulCalls(expert);
            const failedCalls = calculateFailedCalls(expert);
            const avgCallsPerDay = calculateAvgCallsPerDay(expert);
            const missedCalls = calculatemissedCalls(expert);
            wsData.push([
                expert.name,
                successfulCalls,
                failedCalls,
                missedCalls,
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

    const renderSortArrow = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
        }
        return null;
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
                        <th onClick={() => handleSort('missedCalls')}>
                            Missed{renderSortArrow('missedCalls')}
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
                        <th onClick={() => handleSort('status')}>
                            Status{renderSortArrow('status')}
                        </th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {sortData(experts, sortConfig.key, sortConfig.direction).map((expert) => (
                        <tr key={expert._id} className="row">
                            <td>{expert.name}</td>
                            <td>{calculateSuccessfulCalls(expert)}</td>
                            <td>{calculateFailedCalls(expert)}</td>
                            <td>{calculatemissedCalls(expert)}</td>
                            <td>{calculateAvgCallsPerDay(expert).toFixed(2)}</td>
                            <td>{expert.score * 20}</td>
                            <td>{expert.callsShare}%</td>
                            <td>{expert.repeatRate}%</td>
                            <td>{expert.totalScore}</td>
                            <td>{expert.status}</td>
                            <td>
                                <Link to={`/admin/experts/${expert._id}`} className="view-details-link">
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className='popup-button' onClick={downloadExcel}>Export Excel Sheet</button>
        </div>
    );
};

export default ExpertTotalList;