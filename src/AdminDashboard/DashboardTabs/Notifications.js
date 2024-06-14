import React from 'react';
import { Table, ConfigProvider, theme } from 'antd';
import { useErrorLogs } from '../../services/useData';
import LazyLoad from '../../components/LazyLoad/lazyload';

const ErrorLogsComponent = () => {
    const { errorLogs } = useErrorLogs();
    const darkMode = localStorage.getItem('darkMode') === 'true';

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

export default ErrorLogsComponent;