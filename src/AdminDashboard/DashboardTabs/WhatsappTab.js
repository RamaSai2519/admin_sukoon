import Raxios from '../../services/axiosHelper';
import React, { useState, useEffect } from 'react';
import { Table, ConfigProvider, theme } from 'antd';
import Loading from '../../components/Loading/loading';
import LazyLoad from '../../components/LazyLoad/lazyload';

const WhatsappTab = () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';

    const [currentPage, setCurrentPage] = React.useState(
        localStorage.getItem('currentPage') ? parseInt(localStorage.getItem('currentPage')) : 1
    );
    const [totalItems, setTotalItems] = React.useState(0);
    const [pageSize, setPageSize] = React.useState(10);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const fetchData = async (page, size) => {
        setLoading(true);
        const response = await Raxios.get('/data/wahistory', {
            params: { page, size }
        });
        setData(response.data.data);
        setTotalItems(response.data.total);
        setLoading(false);
    };

    useEffect(() => {
        fetchData(currentPage, pageSize);
        // eslint-disable-next-line
    }, [currentPage, pageSize]);

    const columns = [
        { title: "User Name", dataIndex: "userName", key: "userName" },
        { title: "Phone Number", dataIndex: "userNumber", key: "userNumber" },
        { title: "Message", dataIndex: "body", key: "body" },
        { title: "Received At", dataIndex: "createdAt", key: "createdAt" },
    ]

    const handleTableChange = (current, pageSize) => {
        setCurrentPage(current);
        localStorage.setItem('currentPage', current);
        setPageSize(pageSize);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <LazyLoad>
            <ConfigProvider theme={
                {
                    algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                }
            }>
                <div className="min-h-screen py-2">
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
                </div>
            </ConfigProvider>
        </LazyLoad>
    );
};

export default WhatsappTab;