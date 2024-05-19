import React from 'react';
import { Table, ConfigProvider, theme } from 'antd';
import { useData } from '../../../../services/useData';
import './toggle.css';

const ErrorLogsComponent = () => {
    const { errorLogs } = useData();
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
        <ConfigProvider theme={
            {
                algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }
        }>
            <div className="container">
                <div className='w-full'>
                    <Table dataSource={errorLogs} columns={columns} />
                </div>
            </div>
        </ConfigProvider>
    );
};

export default ErrorLogsComponent;