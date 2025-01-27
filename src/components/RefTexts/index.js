import React, { useEffect, useRef, useState } from "react";
import { raxiosFetchData, RaxiosPost } from "../../services/fetchData";
import GetColumnSearchProps from "../../Utils/antTableHelper";
import { useFilters } from "../../contexts/useData";
import { useLocation } from "react-router-dom";
import LazyLoad from "../LazyLoad/lazyload";
import EditableCell from "../EditableCell";
import Loading from "../Loading/loading";
import { Button, Form, Input, Table } from "antd";

const RefTexts = () => {
    const location = useLocation();
    const { filters = {} } = useFilters();
    const filter = filters[location.pathname] || {};

    const searchInputRef = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(
        localStorage.getItem('refTextsPage') ? parseInt(localStorage.getItem('refTextsPage')) : 1
    );
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        await raxiosFetchData(page, 9, setData, setTotal, '/actions/wa_ref', filter, setLoading);
    };

    // eslint-disable-next-line
    useEffect(() => { fetchData() }, [page, JSON.stringify(filter)]);

    const handleTableChange = (current, pageSize) => {
        setPage(current);
        localStorage.setItem('refTextsPage', current);
    };

    const createColumn = (title, dataIndex, key, render, width, editable = true, filter = true) => {
        return {
            key,
            title,
            dataIndex,
            ...(width && { width }),
            ...(render && { render }),
            ...(editable && { editable }),
            ...GetColumnSearchProps(dataIndex, title, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef, location.pathname, filter),
        };
    };

    const columns = [
        createColumn('Source', 'source', 'source'),
        createColumn('Message', 'message', 'message')
    ];

    const handleSave = async ({ key, field, value }) => {
        await RaxiosPost('/actions/wa_ref', { source: key, [field]: value }, true);
        await fetchData();
    };

    const components = { body: { cell: EditableCell } };

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                handleSave,
                title: col.title,
                keyField: 'source',
                editable: col.editable,
                dataIndex: col.dataIndex,
            }),
        };
    });

    const handleFinish = async (values) => {
        await handleSave({ key: values.source, field: 'message', value: '' })
        await fetchData();
    }

    if (loading) { return <Loading /> }

    return (
        <LazyLoad>
            <div className="min-h-screen overflow-auto flex flex-col pt-2">
                <Form layout="inline" className="mb-2" onFinish={handleFinish}>
                    <Form.Item
                        name="source"
                        rules={[{ required: true, message: 'Please input the source!' }]}
                    >
                        <Input placeholder="Enter Source" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add
                        </Button>
                    </Form.Item>
                </Form>
                <Table
                    dataSource={data}
                    columns={mergedColumns}
                    components={components}
                    rowKey={(record) => record.source}
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

export default RefTexts;