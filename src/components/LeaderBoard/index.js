import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import Loading from '../Loading/loading';
import { raxiosFetchData } from '../../services/fetchData';


const LeaderBoard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        const response = await raxiosFetchData(null, null, null, null, '/actions/leaderboard', { game_type: 'quiz' }, setLoading);
        if (response) { setData(response) }
    };

    // eslint-disable-next-line
    useEffect(() => { fetchData() }, []);

    if (loading) return <Loading />;

    const columns = [
        {
            title: 'Position',
            key: 'position',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'User Name',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: 'Highest Score',
            dataIndex: 'highest_score',
            key: 'highest_score',
        },
    ];

    return (
        <div className='pr-10'>
            <h1>Leaderboard</h1>
            <Table
                bordered
                columns={columns}
                dataSource={data}
                rowKey={record => record._id}
            />
        </div>
    );
};

export default LeaderBoard;
