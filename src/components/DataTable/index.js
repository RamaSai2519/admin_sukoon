import React from 'react';
import { Table } from 'antd';
import mockData from '../mockData';

const columns = [
    {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
    },
    {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
    },
];

const DataTable = ({ data }) => (
    <div className='overflow-auto'>
        <Table

            columns={columns}
            dataSource={data}
            pagination={false}
        />
    </div>
);

const DynamicTable = ({ view }) => {
    return (
        <div className='w-full h-full'>
            {view === 'successfulCalls' && <DataTable data={mockData.successfulCalls} />}
            {view === 'avgCallDuration' && <DataTable data={mockData.avgCallDuration} />}
            {view === 'otherStats' && <DataTable data={mockData.otherStats} />}
        </div>
    );
};

export default DynamicTable;
