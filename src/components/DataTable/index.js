import React from 'react';
import { Table } from 'antd';
import { useInsights } from '../../services/useData';

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
            rowKey={(record) => record.category}
            columns={columns}
            dataSource={data}
            pagination={false}
        />
    </div>
);

const InsightsTable = ({ view }) => {
    const { insights } = useInsights();

    return (
        <div className='w-full'>
            {view === 'Split By Duration' && <DataTable data={insights.successfulCalls} />}
            {view === 'Average Call Durations' && <DataTable data={insights.avgCallDuration} />}
            {view === 'Split Of Calls' && <DataTable data={insights.otherStats} />}
        </div>
    );
};

export default InsightsTable;
