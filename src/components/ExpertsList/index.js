import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useExperts, useCalls } from '../../services/useData';
import CreateCategoryPopup from '../Popups/CreateCategoryPopup';
import Raxios from '../../services/axiosHelper';
import { downloadExcel } from '../../Utils/exportHelper';
import { Table, Button } from 'antd';

const ExpertsList = () => {
    const { experts, fetchExperts } = useExperts();
    const { calls, fetchCalls } = useCalls();
    const [visible, setVisible] = React.useState(false);

    React.useEffect(() => {
        fetchCalls();
        fetchExperts();
        // eslint-disable-next-line
    }, []);

    const navigate = useNavigate();

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
            title: 'Expert', dataIndex: 'name', key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Logged In Hours', dataIndex: 'timeSpent', key: 'timeSpent',
            sorter: (a, b) => a.timeSpent - b.timeSpent,
        },
        {
            title: 'Successful', dataIndex: 'successfulCalls', key: 'successfulCalls',
            sorter: (a, b) => a.successfulCalls - b.successfulCalls,
        },
        {
            title: 'Failed', dataIndex: 'failedCalls', key: 'failedCalls',
            sorter: (a, b) => a.failedCalls - b.failedCalls,
        },
        {
            title: 'Missed', dataIndex: 'missedCalls', key: 'missedCalls',
            sorter: (a, b) => a.missedCalls - b.missedCalls,
        },
        {
            title: 'Avg.', dataIndex: 'avgCallsPerDay', key: 'avgCallsPerDay',
            sorter: (a, b) => a.avgCallsPerDay - b.avgCallsPerDay,
        },
        {
            title: 'C.Score', dataIndex: 'score', key: 'score',
            sorter: (a, b) => a.score - b.score,
        },
        {
            title: 'Share', dataIndex: 'calls_share', key: 'calls_share',
            sorter: (a, b) => a.calls_share.localeCompare(b.calls_share),
        },
        {
            title: 'Repeat %', dataIndex: 'repeat_score', key: 'repeat_score',
            sorter: (a, b) => a.repeat_score.localeCompare(b.repeat_score),
        },
        {
            title: 'T.Score', dataIndex: 'total_score', key: 'total_score',
            sorter: (a, b) => a.total_score - b.total_score,
        },
        {
            title: 'Status', dataIndex: 'status', key: 'status',
            sorter: (a, b) => a.status.localeCompare(b.status),
        },
        {
            title: 'Details', key: 'details',
            render: (record) => (
                localStorage.setItem('expertId', record.key),
                <Link to={{pathname: `/admin/experts/${record.phoneNumber}`}} className="view-details-link">
                    View
                </Link>
            ),
        },
    ];

    const dataSource = experts.map((expert) => ({
        key: expert._id,
        name: expert.name,
        phoneNumber: expert.phoneNumber,
        timeSpent: expert.timeSpent + ' h',
        successfulCalls: calculateSuccessfulCalls(expert),
        failedCalls: calculateFailedCalls(expert),
        missedCalls: calculatemissedCalls(expert),
        avgCallsPerDay: calculateAvgCallsPerDay(expert).toFixed(2),
        score: expert?.score || 0,
        calls_share: (expert?.calls_share || 0) + '%',
        repeat_score: (expert?.repeat_score || 0) + '%',
        total_score: (expert?.total_score || 0) + '%',
        status: expert.status,
    }));

    const exportToExcel = async () => {
        downloadExcel(dataSource, 'experts.xlsx');
    };

    const createExpert = async () => {
        const response = await Raxios.post('/expert/create');
        navigate(`/admin/experts/${response.data}`);
    }

    return (
        <div className='w-full mx-auto overflow-auto mt-2'>
            <div className='flex gap-2 justify-end mb-2'>
                <Button onClick={() => setVisible(true)} type="primary">
                    Create Category
                </Button>
                <Button onClick={createExpert} type="primary">
                    Create Expert
                </Button>
            </div>
            <Table
                dataSource={dataSource}
                columns={columns}
            />
            <Button onClick={exportToExcel}>Export Excel Sheet</Button>
            {visible && <CreateCategoryPopup visible={visible} setVisible={setVisible} />}
        </div>
    );
};

export default ExpertsList;