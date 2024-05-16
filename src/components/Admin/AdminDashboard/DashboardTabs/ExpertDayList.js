import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../../../services/useData';
import * as XLSX from 'xlsx';

const ExpertDayList = () => {
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

    const renderSortArrow = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
        }
        return null;
    };

    const calculateSortValue = (item, key) => {
        switch (key) {
            case 'successfulCalls':
                return calculateSuccessfulCalls(item);
            case 'failedCalls':
                return calculateFailedCalls(item);
            case 'MissedCalls':
                return calculateMissedCalls(item);
            case 'avgCallsPerDay':
                return calculateAvgCallsPerDay(item);
            default:
                return item[key];
        }
    };

    const calculateSuccessfulCalls = (expert) => {
        const currentDate = new Date().toISOString().split('T')[0];
        const expertCalls = calls.filter(call => call.expert === expert._id);
        const callsDataCurrentDay = expertCalls.filter(call => {
            const callDate = new Date(call.initiatedTime).toISOString().split('T')[0];
            return callDate === currentDate;
        });
        return callsDataCurrentDay.filter(call => call.status === 'successful').length;
    };

    const calculateFailedCalls = (expert) => {
        const currentDate = new Date().toISOString().split('T')[0];
        const expertCalls = calls.filter(call => call.expert === expert._id);
        const callsDataCurrentDay = expertCalls.filter(call => {
            const callDate = new Date(call.initiatedTime).toISOString().split('T')[0];
            return callDate === currentDate;
        });
        return callsDataCurrentDay.filter(call => call.status === 'failed').length;
    };

    const calculateMissedCalls = (expert) => {
        const currentDate = new Date().toISOString().split('T')[0];
        const expertCalls = calls.filter(call => call.expert === expert._id);
        const callsDataCurrentDay = expertCalls.filter(call => {
            const callDate = new Date(call.initiatedTime).toISOString().split('T')[0];
            return callDate === currentDate;
        });
        return callsDataCurrentDay.filter(call => call.status === 'missed').length;
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
        const wb = XLSX.utils.book_new();
        const wsData = [
            ['Expert', 'Success', 'Failed', 'Missed', 'Avg.', 'C.Score', 'Share', 'Repeat %', 'T.Score', 'Status'] // Header row
        ];
        sortData(experts, sortConfig.key, sortConfig.direction).forEach((expert) => {
            const successfulCalls = calculateSuccessfulCalls(expert);
            const failedCalls = calculateFailedCalls(expert);
            const missedCalls = calculateMissedCalls(expert);
            const avgCallsPerDay = calculateAvgCallsPerDay(expert);
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

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Expert_Data'); // Append worksheet to workbook

        XLSX.writeFile(wb, 'ExpertDayList.xlsx');
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
                            Success{renderSortArrow('successfulCalls')}
                        </th>
                        <th onClick={() => handleSort('failedCalls')}>
                            Failed{renderSortArrow('failedCalls')}
                        </th>
                        <th onClick={() => handleSort('MissedCalls')}>
                            Missed{renderSortArrow('MissedCalls')}
                        </th>
                        <th onClick={() => handleSort('avgCallsPerDay')}>
                            Avg.{renderSortArrow('avgCallsPerDay')}
                        </th>
                        <th>Status</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {sortData(experts, sortConfig.key, sortConfig.direction).map((expert) => (
                        <tr key={expert._id} className="row">
                            <td>{expert.name}</td>
                            <td>{calculateSuccessfulCalls(expert)}</td>
                            <td>{calculateFailedCalls(expert)}</td>
                            <td>{calculateMissedCalls(expert)}</td>
                            <td>{calculateAvgCallsPerDay(expert).toFixed(2)}</td>
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

export default ExpertDayList;
