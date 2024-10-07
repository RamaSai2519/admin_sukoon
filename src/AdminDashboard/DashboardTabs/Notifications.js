import React, { useState, useEffect } from 'react';
import Loading from '../../components/Loading/loading';
import LazyLoad from '../../components/LazyLoad/lazyload';
import { raxiosFetchData } from '../../services/fetchData';
import { formatTime } from '../../Utils/formatHelper';
import { Table } from 'antd';

const NotificationsTab = () => {
    const [loading, setLoading] = useState(false);
    const [errorLogs, setErrorLogs] = useState([]);
    const [errorLogsPage, setErrorLogsPage] = useState(
        localStorage.getItem('errorLogsPage') ? parseInt(localStorage.getItem('errorLogsPage')) : 1
    );
    const [errorLogsPageSize, setErrorLogsPageSize] = useState(10);
    const [errorLogsTotal, setErrorLogsTotal] = useState(0);

    const handleTableChange = (current, pageSize) => {
        setErrorLogsPage(current);
        localStorage.setItem('errorLogsPage', current);
        setErrorLogsPageSize(pageSize);
    };

    useEffect(() => {
        raxiosFetchData(errorLogsPage, errorLogsPageSize, setErrorLogs, setErrorLogsTotal, '/logs', null, setLoading);
    }, [errorLogsPage, errorLogsPageSize]);

    const columns = [
        {
            title: 'Time', dataIndex: 'time', key: 'time',
            render: (time) => formatTime(time)
        },
        { title: 'Message', dataIndex: 'message', key: 'message' }
    ];

    if (loading) { return <Loading />; }

    return (
        <LazyLoad>
            <div className="min-h-screen py-2">
                <div className='w-full'>
                    <Table
                        dataSource={errorLogs}
                        columns={columns}
                        pagination={{
                            current: errorLogsPage,
                            pageSize: errorLogsPageSize,
                            total: errorLogsTotal,
                            onChange: handleTableChange
                        }}
                        rowKey={(record) => record._id}
                    />
                </div>
            </div>
        </LazyLoad>
    );
};

export default NotificationsTab;