import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ApprovePage = () => {
    const { scheduleId } = useParams();
    const { level } = useParams();
    const [expert, setExpert] = useState('');
    const [user, setUser] = useState('');
    const [datetime, setTime] = useState('');

    const fetchData = async () => {
        try {
            const schedulesResponse = await axios.get(`/api/schedule/${scheduleId}`);
            setExpert(schedulesResponse.data.expert);
            setUser(schedulesResponse.data.user);
            setTime(schedulesResponse.data.datetime);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [expert, user]);

    const handleClick = async (value) => {
        const status = {
            status: value
        }
        await axios.put(`/api/approve/${scheduleId}/${level}`, status);
    };

    return (
        <div className='grid-tile-1'>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '80vh', width: 'fit-content', margin: '0 auto' }}>
                <h1>Approve the Scheduled Call</h1>
                <h2>Expert: {expert}</h2>
                <h2>User: {user}</h2>
                <h2>Time: {datetime}</h2>
                <div>
                    <Button style={{ margin: '10px', backgroundColor: 'green' }} type="primary" onClick={() => handleClick("Approved")}>Approve</Button>
                    <Button style={{ margin: '10px', backgroundColor: 'red' }} type="primary" onClick={() => handleClick("Rejected")}>Reject</Button>
                </div>
            </div>
        </div>
    );
};

export default ApprovePage;
