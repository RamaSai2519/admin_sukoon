import React from 'react';
import { Table } from 'antd';
import Loading from '../Loading/loading';
import LazyLoad from '../LazyLoad/lazyload';

const WaWhHistory = ({ data, currentPage, pageSize, totalItems, handleTableChange, loading }) => {
    const columns = [
        { title: "User Name", dataIndex: "userName", key: "userName" },
        { title: "Phone Number", dataIndex: "userNumber", key: "userNumber" },
        { title: "Message", dataIndex: "body", key: "body" },
        { title: "Received At", dataIndex: "createdAt", key: "createdAt" },
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
