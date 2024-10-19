import React from 'react';
import { Table } from 'antd';
import { formatTime } from '../Utils/formatHelper';

const LogsTable = ({ data }) => {
    const columns = [
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
            width: '20%',
            render: (time) => formatTime(time),
        },
    ];

    return <Table columns={columns} dataSource={data} rowKey="id" />;
};

const TopicsTable = ({ data }) => {
    console.log("🚀 ~ TopicsTable ~ data:", data)
    
    const columns = [
        {
            title: 'Topic',
            dataIndex: 'topic',
            key: 'topic',
        },
        {
            title: 'Sub Topic',
            dataIndex: 'sub_topic',
            key: 'sub_topic',
        }
    ];
    

    return <Table columns={columns} dataSource={data || [data]} rowKey="id" />;
};

export { LogsTable, TopicsTable };