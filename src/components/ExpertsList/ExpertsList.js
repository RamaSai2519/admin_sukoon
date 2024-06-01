import React from 'react';
import { Link } from 'react-router-dom';
import { useExperts, useCalls } from '../../services/useData';
import { Table, Button, ConfigProvider, theme } from 'antd';
import writeXlsxFile from 'write-excel-file';
import { saveAs } from 'file-saver';

const ExpertsList = () => {
    const { experts } = useExperts();
    const { calls } = useCalls();
    const darkMode = localStorage.getItem('darkMode') === 'true';

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

    const columns = [
        {
            title: 'Expert',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Successful',
            dataIndex: 'successfulCalls',
            key: 'successfulCalls',
            sorter: (a, b) => a.successfulCalls - b.successfulCalls,
        },
        {
            title: 'Failed',
            dataIndex: 'failedCalls',
            key: 'failedCalls',
            sorter: (a, b) => a.failedCalls - b.failedCalls,
        },
        {
            title: 'Missed',
            dataIndex: 'missedCalls',
            key: 'missedCalls',
            sorter: (a, b) => a.missedCalls - b.missedCalls,
        },
        {
            title: 'Avg.',
            dataIndex: 'avgCallsPerDay',
            key: 'avgCallsPerDay',
            sorter: (a, b) => a.avgCallsPerDay - b.avgCallsPerDay,
        },
        {
            title: 'C.Score',
            dataIndex: 'score',
            key: 'score',
            sorter: (a, b) => a.score - b.score,
        },
        {
            title: 'Share',
            dataIndex: 'callsShare',
            key: 'callsShare',
            sorter: (a, b) => a.callsShare.localeCompare(b.callsShare),
        },
        {
            title: 'Repeat %',
            dataIndex: 'repeatRate',
            key: 'repeatRate',
            sorter: (a, b) => a.repeatRate.localeCompare(b.repeatRate),
        },
        {
            title: 'T.Score',
            dataIndex: 'totalScore',
            key: 'totalScore',
            sorter: (a, b) => a.totalScore - b.totalScore,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status.localeCompare(b.status),
        },
        {
            title: 'Details',
            key: 'details',
            render: (record) => (
                <Link to={`/admin/experts/${record.key}`} className="view-details-link">
                    View
                </Link>
            ),
        },
    ];

    const dataSource = experts.map((expert) => ({
        key: expert._id,
        name: expert.name,
        successfulCalls: calculateSuccessfulCalls(expert),
        failedCalls: calculateFailedCalls(expert),
        missedCalls: calculatemissedCalls(expert),
        avgCallsPerDay: calculateAvgCallsPerDay(expert).toFixed(2),
        score: expert.score * 20,
        callsShare: expert.callsShare + '%',
        repeatRate: expert.repeatRate + '%',
        totalScore: expert.totalScore,
        status: expert.status,
    }));

    const exportToExcel = async () => {
        // Assuming dataSource is an array of objects
        const wsData = [
            Object.keys(dataSource[0]).map(key => ({ value: key }))  // Header row
        ];
        dataSource.forEach((row) => {
            wsData.push(
                Object.values(row).map(value => ({ value }))
            );
        });
        const buffer = await writeXlsxFile(wsData, {
            headerStyle: {
                fontWeight: 'bold'
            },
            buffer: true
        });
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'ExpertsData.xlsx');
    };


    return (
        <div className='w-full mx-auto overflow-auto'>
            <ConfigProvider theme={
                {
                    algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                }
            }>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                />
                <Button className='' onClick={exportToExcel}>Export Excel Sheet</Button>
            </ConfigProvider>
        </div>

    );
};

export default ExpertsList;