import React, { useEffect, useRef, useState } from "react";
import { Button, Checkbox, DatePicker, Form, Input, Modal, Select, Table, TimePicker } from "antd";
import dayjs from "dayjs";
import Loading from "../Loading/loading";
import { useLocation } from "react-router-dom";
import { useFilters } from "../../contexts/useData";
import { raxiosFetchData, RaxiosPost } from "../../services/fetchData";
import GetColumnSearchProps from "../../Utils/antTableHelper";

const ReSchedulesTable = ({ reformChange }) => {
    const location = useLocation();
    const { filters = {}, setFilters } = useFilters();
    const filter = filters[location.pathname] || {};

    const [job, setJob] = useState({});
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [reSchedulesPage, setReSchedulesPage] = useState(
        localStorage.getItem("reSchedulesPage") ? parseInt(localStorage.getItem("reSchedulesPage")) : 1
    );
    const [loading, setLoading] = useState(false);
    const [expired, setExpired] = useState(false);
    const [reSchedules, setReSchedules] = useState([]);

    const searchInputRef = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const handleTableChange = (current, pageSize) => {
        setPageSize(pageSize);
        setReSchedulesPage(current);
        localStorage.setItem('reSchedulesPage', current);
    };

    const fetchReSchedules = async () => {
        const optional = { expired, ...filter };
        raxiosFetchData(reSchedulesPage, pageSize, setReSchedules, setTotal, '/actions/reschedules', optional, setLoading);
    };

    const handleSetJob = (record) => {
        const job = {
            ...record,
            job_time: dayjs(record.job_time, 'HH:mm'),
            job_expiry: dayjs(record.job_expiry, 'YYYY-MM-DD')
        };
        setJob(job);
    }

    // eslint-disable-next-line
    useEffect(() => { fetchReSchedules() }, [reSchedulesPage, pageSize, JSON.stringify(filter), expired]);

    const createColumn = (title, dataIndex, key, render, sorter, filter = true) => ({
        title, dataIndex, key, ...(sorter && { sorter }), ...(render && { render }),
        ...GetColumnSearchProps(dataIndex, title, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef, location.pathname, filter),
    });

    const handleViewSchedules = (record) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [location.pathname]: { filter_field: 'reschedule_id', filter_value: record._id }
        }));
        reformChange();
    };

    const columns = [
        createColumn('User', 'user', 'user'),
        createColumn('Expert', 'expert', 'expert'),
        createColumn('Job Time', 'job_time', 'job_time'),
        createColumn('Frequency', 'frequency', 'frequency'),
        {
            title: 'Action', key: 'action',
            render: (_, record) => (
                <div className="flex gap-2">
                    <Button onClick={() => handleSetJob(record)}>Edit</Button>
                    <Button onClick={() => handleViewSchedules(record)}>View Jobs</Button>
                </div>
            )
        }
    ];

    const handleFinish = async (values) => {
        const payload = {
            ...job,
            ...values,
            job_time: values.job_time.format('HH:mm')
        }
        const response = await RaxiosPost('/actions/reschedules', payload, true, setLoading);
        if (response.status === 200) { setJob({}); fetchReSchedules(); }
    };

    return (
        <>
            <div className="w-4/5">
                {loading ? <Loading /> :
                    <div className="flex flex-col gap-2">
                        <div className="flex w-full justify-end gap-5">
                            <Checkbox
                                checked={expired}
                                onChange={(e) => setExpired(e.target.checked)}
                            >Show Expired</Checkbox>
                        </div>
                        <Table
                            columns={columns}
                            dataSource={reSchedules}
                            pagination={{ total, pageSize, current: reSchedulesPage, onChange: handleTableChange, showSizeChanger: true }}
                            loading={loading}
                            rowKey={record => record._id}
                        />
                    </div>
                }
            </div>
            <Modal
                title="Recurring Schedule Details"
                open={job._id}
                onCancel={() => setJob({})}
                footer={[]}
            >
                <Form name="reSchedules" initialValues={job} onFinish={handleFinish} layout="vertical">
                    <div className="grid md:grid-cols-2 gap-x-5">
                        <Form.Item name="name" label="Created By">
                            <Input disabled className="dark:text-white text-black" />
                        </Form.Item>
                        <Form.Item name='job_time' label="Job Time">
                            <TimePicker showSecond={false} className="w-full" />
                        </Form.Item>
                        <Form.Item name="user" label="User">
                            <Input disabled className="dark:text-white text-black" />
                        </Form.Item>
                        <Form.Item name="expert" label="Expert">
                            <Input disabled className="dark:text-white text-black" />
                        </Form.Item>
                        <Form.Item name="frequency" label="Frequency">
                            <Select
                                className="w-full" showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {['Daily', 'Weekly', 'Monthly'].map((item, index) => <Select.Option key={index} value={item.toLowerCase()}>{item}</Select.Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item name="job_expiry" label="Job Expiry">
                            <DatePicker className="w-full" format="YYYY-MM-DD" />
                        </Form.Item>
                    </div>
                    <Form.Item name="week_days" label="Week Days">
                        <Select
                            className="w-full" mode="multiple"
                        >
                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((item, index) => <Select.Option key={index} value={item.toLowerCase()}>{item}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="month_days" label="Month Days">
                        <Select
                            className="w-full" mode="multiple"
                        >
                            {[...Array(31).keys()].map((item, index) => <Select.Option key={index} value={item + 1}>{item + 1}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button block type="primary" htmlType="submit" loading={loading}
                        >Save Changes</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );

};

export default ReSchedulesTable;