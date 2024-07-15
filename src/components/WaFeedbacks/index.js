import React from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import Loading from '../Loading/loading';
import LazyLoad from '../LazyLoad/lazyload';
import { formatTime } from '../../Utils/formatHelper';


const WaFeedbacks = ({ data, currentPage, pageSize, totalItems, handleTableChange, loading }) => {
    const columns = [
        { title: "User Name", dataIndex: "userName", key: "userName" },
        { title: "Expert Name", dataIndex: "expertName", key: "expertName" },
        { title: "Message", dataIndex: "body", key: "body" },
        {
            title: "Received At", dataIndex: "createdAt", key: "createdAt",
            render: (time) => time ? formatTime(time) : ''
        },
        {
            title: "Call Details", key: "callId",
            render: (_, record) => (
                <Link to={`/admin/calls/${record.callId}`} className="view-details-link">
                    View
                </Link>
            )
        }
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
                    onChange: handleTableChange
                }}
            />
        </LazyLoad>
    );
};

export default WaFeedbacks;
