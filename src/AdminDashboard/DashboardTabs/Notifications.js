import React, { useState, useEffect } from 'react';
import { Table, ConfigProvider, theme } from 'antd';
import { useErrorLogs } from '../../services/useData';
import Loading from '../../components/Loading/loading';
import LazyLoad from '../../components/LazyLoad/lazyload';

const NotificationsTab = () => {
    const { errorLogs, fetchErrorLogs } = useErrorLogs();
    const [loading, setLoading] = useState(false);
    const darkMode = localStorage.getItem('darkMode') === 'true';

    const fetchData = async () => {
        setLoading(true);
        await fetchErrorLogs();
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    const columns = [
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            render: (time) => new Date(time).toLocaleString()
        },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message'
        }
    ];

    if (loading) {
        return <Loading />;
    }

    return (
        <LazyLoad>
            <ConfigProvider theme={
                {
                    algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                }
            }>
                <div className="min-h-screen py-2">
                    <div className='w-full'>
                        <Table dataSource={errorLogs} columns={columns} />
                    </div>
                </div>
            </ConfigProvider>
        </LazyLoad>
    );
};

export default NotificationsTab;