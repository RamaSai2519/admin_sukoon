import React, { useEffect, useRef, useState } from "react";
import { raxiosFetchData, RaxiosPost } from "../../services/fetchData";
import GetColumnSearchProps from "../../Utils/antTableHelper";
import { useFilters } from "../../contexts/useData";
import { Button, Form, Input, Table } from "antd";
import { useLocation } from "react-router-dom";
import LazyLoad from "../LazyLoad/lazyload";
import Loading from "../Loading/loading";

const BetaTesters = () => {
    const location = useLocation();
    const { filters = {} } = useFilters();
    const filter = filters[location.pathname] || {};

    const searchInputRef = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(
        localStorage.getItem('betaTestersPage') ? parseInt(localStorage.getItem('betaTestersPage')) : 1
    );
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        await raxiosFetchData(page, 10, setData, setTotal, '/actions/beta_tester', filter, setLoading);
    };

    // eslint-disable-next-line
    useEffect(() => { fetchData() }, [page, JSON.stringify(filter)]);

    const handleTableChange = (current, pageSize) => {
        setPage(current);
        localStorage.setItem('betaTestersPage', current);
    };

    const createColumn = (title, dataIndex, key, render, width, filter = true) => {
        return {
            key,
            title,
            dataIndex,
            ...(width && { width }),
            ...(render && { render }),
            ...GetColumnSearchProps(dataIndex, title, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef, location.pathname, filter),
        };
    };

    const columns = [
        createColumn('Phone Number', 'phoneNumber', 'phoneNumber'),
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button type="primary" danger onClick={async () => {
                    await RaxiosPost('/actions/beta_tester', { phoneNumber: record.phoneNumber, isDeleted: true }, true);
                    await fetchData();
                }}>Delete</Button>
            )
        }
    ];


    const handleFinish = async (values) => {
        await RaxiosPost('/actions/beta_tester', values, true);
        await fetchData();
    }

    if (loading) { return <Loading /> }

    return (
        <LazyLoad>
            <div className="min-h-screen overflow-auto flex flex-col pt-2">
                <Form layout="inline" className="mb-2" onFinish={handleFinish}>
                    <Form.Item
                        name="phoneNumber"
                        rules={[{ required: true, message: 'Please input the number!' }]}
                    >
                        <Input placeholder="Enter Phone Number" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add
                        </Button>
                    </Form.Item>
                </Form>
                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey={(record) => record.phoneNumber}
                    pagination={{
                        pageSize: 9,
                        total: total,
                        current: page,
                        showSizeChanger: false,
                        onChange: handleTableChange
                    }}
                />
            </div>
        </LazyLoad>
    );
};

export default BetaTesters;