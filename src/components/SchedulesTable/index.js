import React, { useEffect, useRef, useState } from "react";
import Loading from "../Loading/loading";
import { Button, Checkbox, Table } from "antd";
import { useLocation } from "react-router-dom";
import { useFilters } from "../../contexts/useData";
import { formatTime } from "../../Utils/formatHelper";
import GetColumnSearchProps from "../../Utils/antTableHelper";
import { raxiosFetchData, RaxiosPost } from "../../services/fetchData";

const SchedulesTable = () => {
    const location = useLocation();
    const { filters = {} } = useFilters();
    const filter = filters[location.pathname] || {};

    const [total, setTotal] = useState(0);
    const [schedulesPage, setSchedulesPage] = useState(
        localStorage.getItem("schedulesPage") ? parseInt(localStorage.getItem("schedulesPage")) : 1
    );
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [isDeleted, setIsDeleted] = useState(false);

    const searchInputRef = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [responseLoading, setResponseLoading] = useState(false);

    const handleTableChange = (current, pageSize) => {
        setPageSize(pageSize);
        setSchedulesPage(current);
        localStorage.setItem('schedulesPage', current);
    };

    const fetchSchedules = async () => {
        const optional = { isDeleted, ...filter };
        raxiosFetchData(schedulesPage, pageSize, setSchedules, setTotal, '/actions/schedules', optional, setLoading);
    };

    // eslint-disable-next-line
    useEffect(() => { fetchSchedules() }, [schedulesPage, pageSize, JSON.stringify(filter), isDeleted]);

    const createColumn = (title, dataIndex, key, sorter, render, filter = true) => ({
        title,
        dataIndex,
        key,
        ...GetColumnSearchProps(dataIndex, title, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef, location.pathname, filter),
        ...(sorter && { sorter }),
        ...(render && { render })
    });

    const columns = [
        createColumn("User", "user", "user"),
        createColumn("Expert", "expert", "expert"),
        createColumn("Date & Time", "datetime", "datetime",
            (a, b) => new Date(a.datetime) - new Date(b.datetime),
            (record) => formatTime(record), false),
        createColumn("Status", "status", "status"),
        createColumn('Scheduled By', 'initiatedBy', 'initiatedBy'),
        createColumn('Source', 'source', 'source', null, null, false),
        {
            title: "Action", key: "action",
            render: (_, record) => (
                <Button
                    disabled={record.isDeleted}
                    loading={responseLoading}
                    onClick={() => !record.isDeleted && handleDelete(record)}
                >
                    {record.isDeleted ? "Canceled" : "Cancel"}
                </Button>
            )
        }
    ];

    const handleDelete = async (record) => {
        const payload = { _id: record._id, isDeleted: true }
        const response = await RaxiosPost('/actions/schedules', payload, true, setResponseLoading);
        if (response.status === 200) {
            schedules.find(s => s._id === record._id).isDeleted = true;
        }
    };

    return (
        <div className="w-4/5">
            {loading ? <Loading /> : (
                <div className="flex flex-col gap-2">
                    <div className="flex w-full justify-end gap-5">
                        <Checkbox
                            checked={isDeleted}
                            onChange={(e) => setIsDeleted(e.target.checked)}
                        >
                            Show Deleted
                        </Checkbox>
                    </div>
                    <Table
                        scroll={{ x: 768 }}
                        rowKey={(record) => record._id}
                        dataSource={schedules}
                        columns={columns}
                        pagination={{
                            total,
                            pageSize,
                            showSizeChanger: true,
                            current: schedulesPage,
                            onChange: handleTableChange,
                        }}
                    />
                </div>
            )}
        </div>
    )
};

export default SchedulesTable;