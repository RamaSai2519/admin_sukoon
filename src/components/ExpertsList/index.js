import { Table, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import InternalToggle from '../InternalToggle';
import { RaxiosPost } from '../../services/fetchData';
import React, { useEffect, useState } from 'react';
import { calculateCallStats, columns } from './helper';
import { downloadExcel } from '../../Utils/exportHelper';
import { useExperts, useCalls } from '../../services/useData';
import CreateCategoryPopup from '../Popups/CreateCategoryPopup';

const ExpertsList = () => {
    const navigate = useNavigate();
    const { calls, fetchCalls } = useCalls();
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const { experts, fetchExperts } = useExperts();
    const [buttonLoading, setButtonLoading] = useState(false);
    const [internalView, setInternalView] = useState(
        localStorage.getItem('internalView') === 'true' ? true : false
    );

    const fetchData = async () => {
        setLoading(true);
        await fetchExperts(internalView);
        setLoading(false);
        await fetchCalls(internalView);
    };

    // eslint-disable-next-line
    useEffect(() => { fetchData() }, [internalView]);

    const dataSource = experts.map((expert) => {
        const expertCalls = calls.filter(call => call.expert === expert._id);
        const stats = calculateCallStats(expertCalls, expert);
        return {
            key: expert._id,
            status: expert.status,
            failedCalls: stats.failed,
            missedCalls: stats.missed,
            phoneNumber: expert.phoneNumber,
            successfulCalls: stats.successful,
            daysLoggedIn: expert.daysLoggedIn,
            timeSpent: expert.timeSpent + ' h',
            utilization: stats.utilization + '%',
            avgCallsPerDay: stats.avgCallsPerDay,
            hoursSpoken: stats.hoursSpoken + ' h',
            score: (expert?.score * 20 || 0) + '%',
            name: expert.name || expert.phoneNumber,
            uniqueDaysSpoken: stats.uniqueDaysSpoken,
            failedCallsCent: stats.failedCallsCent + '%',
            missedCallsCent: stats.missedCallsCent + '%',
            total_score: (expert?.total_score || 0) + '%',
            calls_share: (expert?.calls_share || 0) + '%',
            repeat_score: (expert?.repeat_score || 0) + '%',
            successfulCallsCent: stats.successfulCallsCent + '%',
            avgSuccessfulCallDuration: stats.avgSuccessfulCallDuration + ' min',
        };
    }).sort((a, b) => (a.name.replace('Sarathi ', '')).localeCompare(b.name.replace('Sarathi ', '')));

    const exportToExcel = async () => {
        setButtonLoading(true);
        await downloadExcel(dataSource, 'experts.xlsx');
        setButtonLoading(false);
    };

    const createExpert = async () => {
        const expertNumber = window.prompt("Enter the phone number of the new expert:");
        if (expertNumber) {
            const response = await RaxiosPost('/expert', { phoneNumber: expertNumber });
            if (response.status !== 200) {
                message.error(response.msg);
            } else navigate(`/admin/experts/${expertNumber}`);
        }
    };

    return (
        <div className='w-full mx-auto overflow-auto mt-2'>
            <div className='flex items-center justify-between mb-2'>
                <h3 className='text-2xl font-bold'>{internalView ? "Internals" : "Experts & Sarathis"}</h3>
                <div className='flex gap-2 items-center'>
                    <InternalToggle internalView={internalView} setInternalView={setInternalView} disable={loading} />
                    {/* <Button loading={buttonLoading} onClick={exportToExcel}>Export Excel Sheet</Button> */}
                    <Button onClick={() => setVisible(true)} type="primary">
                        Create Category
                    </Button>
                    <Button onClick={createExpert} type="primary">
                        Create Expert
                    </Button>
                </div>
            </div>
            <Table
                dataSource={dataSource}
                columns={columns}
                loading={loading}
                scroll={{
                    x: 'calc(100vw + 600px)'
                }}
            />
            {visible && <CreateCategoryPopup visible={visible} setVisible={setVisible} />}
        </div>
    );
};

export default ExpertsList;