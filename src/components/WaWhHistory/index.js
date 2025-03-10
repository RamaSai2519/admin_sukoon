import React from 'react';
import { Button, Table } from 'antd';
import Loading from '../Loading/loading';
import LazyLoad from '../LazyLoad/lazyload';
import { useNavigate } from 'react-router-dom';
import { formatTime } from '../../Utils/formatHelper';

const WaWhHistory = ({ data, currentPage, pageSize, totalItems, handleTableChange, loading }) => {
    const navigate = useNavigate();
    const handleView = (record) => {
        localStorage.setItem('userNumber', record.userNumber);
        navigate(`/admin/users/${record.userId}#notifications-table`);
    };

    const columns = [
        { title: "User Name", dataIndex: "userName", key: "userName" },
        { title: "Phone Number", dataIndex: "userNumber", key: "userNumber" },
        { title: "Message", dataIndex: "body", key: "body" },
        { title: "Status", dataIndex: "user_status", key: "user_status" },
        { title: "FC Done", dataIndex: "fc_done", key: "fc_done" },
        { title: "Last Internal Call", dataIndex: "last_in_call", key: "last_in_call" },
        {
            title: "Received At", dataIndex: "createdAt", key: "createdAt",
            render: (time) => time ? formatTime(time) : ''
        },
        {
            title: "Action", key: "action", render: (record) => (
                <Button onClick={() => handleView(record)}>
                    View
                </Button>)
        },
    ];

    if (loading) {
        return <Loading />;
    }

    return (
        <LazyLoad>
            <Table
                dataSource={data}
                columns={columns}
                rowKey={(record) => record._id}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalItems,
                    onChange: handleTableChange,
                }}
            />
        </LazyLoad>
    );
};

export default WaWhHistory;
