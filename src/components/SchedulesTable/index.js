import React, { useRef, useState } from "react";
import { formatTime } from "../../Utils/formatHelper";
import { RaxiosPost } from "../../services/fetchData";
import GetColumnSearchProps from "../../Utils/antTableHelper";
import Loading from "../Loading/loading";
import { Button, Table } from "antd";

const SchedulesTable = ({ schedules, loading }) => {
    const searchInputRef = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [responseLoading, setResponseLoading] = useState(false);

    const createColumn = (title, dataIndex, key, sorter, render) => ({
        title,
        dataIndex,
        key,
        ...GetColumnSearchProps(dataIndex, title, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef, null, true),
        ...(sorter && { sorter }),
        ...(render && { render })
    });

    const columns = [
        createColumn("User", "user", "user"),
        createColumn("Expert", "expert", "expert"),
        createColumn("Date & Time", "datetime", "datetime",
            (a, b) => new Date(a.datetime) - new Date(b.datetime),
            (record) => formatTime(record)),
        createColumn("Status", "status", "status"),
        createColumn('Initated By', 'initiatedBy', 'initiatedBy'),
        createColumn('Source', 'source', 'source'),
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
        setResponseLoading(true);
        await RaxiosPost('/actions/update_scheduled_job', {
            scheduled_job_id: record.id,
            action: 'DELETE'
        }, true);
        schedules.find(s => s.id === record.id).isDeleted = true;
        setResponseLoading(false);
    };

    return (
        <div className="w-4/5">
            {loading ? <Loading /> : (
                <div className="flex flex-col gap-2">
                    <Table
                        scroll={{ x: 768 }}
                        rowKey={(record) => record._id}
                        dataSource={schedules}
                        columns={columns}
                    />
                </div>
            )}
        </div>
    )
};

export default SchedulesTable;