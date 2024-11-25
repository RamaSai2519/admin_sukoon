import React from 'react';
import { Button, Modal, Table } from 'antd';
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

const InsightsTable = ({ visible, setVisible }) => {
    const { insights } = useInsights();
    const [view, setView] = React.useState('Split By Duration');

    const handleToggle = () => {
        if (view === 'Split By Duration') {
            setView('Average Call Durations');
        } else if (view === 'Average Call Durations') {
            setView('Split Of Calls');
        } else {
            setView('Split By Duration');
        }
    };

    return (
        <Modal
            title={view}
            open={visible}
            onCancel={() => setVisible(false)}
            footer={null}
        >
            <div className='flex flex-col h-full w-full gap-5'>
                <div className='w-full'>
                    {view === 'Split By Duration' && <DataTable data={insights.successfulCalls} />}
                    {view === 'Average Call Durations' && <DataTable data={insights.avgCallDuration} />}
                    {view === 'Split Of Calls' && <DataTable data={insights.otherStats} />}
                </div>
                <div className='w-full flex items-center justify-end'>
                    <Button className='mt-1' onClick={handleToggle}>
                        Next
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default InsightsTable;
