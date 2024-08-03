import { Select, DatePicker, Form, Button, Table } from "antd";
import { useUsers, useExperts } from "../../services/useData";
import { generateOptions } from "../../Utils/antSelectHelper";
import getColumnSearchProps from "../../Utils/antTableHelper";
import React, { useEffect, useRef, useState } from "react";
import LazyLoad from "../../components/LazyLoad/lazyload";
import Loading from "../../components/Loading/loading";
import { formatTime } from "../../Utils/formatHelper";
import { fetchData } from "../../services/fetchData";
import Raxios from "../../services/axiosHelper";

const SchedulerTab = () => {
    // const [slots, setSlots] = useState([]);
    // const [sValues, setSValues] = useState({ user: "", expert: "", datetime: "" });
    // const [fslot, setFSlot] = useState([]); // Final slot state
    // const [selectedSlot, setSelectedSlot] = useState(null); // Selected slot state

    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const { experts, fetchExperts } = useExperts();
    const { users, fetchUsers } = useUsers();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInputRef = useRef(null);
    const { Option } = Select;

    useEffect(() => {
        fetchData(setSchedules, setLoading, '/data/newSchedules');
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchUsers();
        fetchExperts();
        setLoading(false);
        // eslint-disable-next-line
    }, []);

    const createColumn = (title, dataIndex, key, sorter, render, defaultSortOrder) => {
        return {
            title,
            dataIndex,
            key,
            ...getColumnSearchProps(dataIndex, title, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef),
            ...(sorter && { sorter: sorter }),
            ...(render && { render: render }),
            ...(defaultSortOrder && { defaultSortOrder: defaultSortOrder }),
        };
    };

    const columns = [
        createColumn("User", "user", "user"),
        createColumn("Expert", "expert", "expert"),
        createColumn("Date & Time", "datetime", "datetime",
            (a, b) => new Date(a.datetime) - new Date(b.datetime),
            (record) => formatTime(record), "descend"),
        createColumn("Status", "scheduledJobStatus", "status"),
        {
            title: "Action", key: "action",
            render: (_, record) => <Button disabled onClick={() => handleDelete(record)}>Delete</Button>
        },
    ];

    const handleDelete = async (record) => {
        try {
            await Raxios.delete(`/service/schedule/${record._id}`);
            window.alert("Schedule deleted successfully");
            window.location.reload();
        } catch (error) {
            console.error("Error deleting schedule:", error);
        }
    };

    const onFinish = async (values, endpoint) => {
        try {
            const response = await Raxios.post(endpoint, values);
            if (response.data.success !== true) {
                window.alert(response.data.error?.message || response.data.message);
            } else {
                window.alert("Call connected successfully");
            }
        } catch (error) {
            console.error("Error:", error);
            window.alert(error);
        }
    };

    const onScheduleFinish = async values => {
        try {
            const selectedDateTime = values.datetime;
            const now = new Date();
            if (selectedDateTime <= now) {
                window.alert("Selected time has already passed. Please select a future time.");
            } else {
                await Raxios.post("/data/schedules", {
                    ...values,
                    type: "Admin"
                });
                window.alert("Call Scheduled successfully");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <LazyLoad>
            <div className="flex items-center justify-center gap-4 h-full">
                <div className="w-3/4">
                    {loading ? <Loading /> :
                        <div className="flex flex-col gap-2">
                            <Table
                                rowKey={(record) => record._id}
                                dataSource={schedules}
                                columns={columns}
                            />
                        </div>
                    }
                </div>
                <div className="flex flex-col h-full border-l-2 dark:border-lightBlack pl-2 justify-center">
                    <h1 className="text-2xl font-bold mb-3">Connect a Call</h1>
                    <Form
                        name="connect-call"
                        className="grid grid-cols-2 gap-2 w-full border-b-2 dark:border-lightBlack pb-4"
                        onFinish={(values) => onFinish(values, "/call/connect")}
                    >
                        <Form.Item
                            name="user"
                            rules={[{ required: true, message: "Please select a user" }]}
                        >
                            <Select
                                className="w-full"
                                showSearch
                                placeholder="Select User"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {generateOptions(users, "name")}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="expert"
                            rules={[{ required: true, message: "Please select an expert" }]}
                        >
                            <Select
                                className="w-full"
                                showSearch
                                placeholder="Select Expert"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {generateOptions(experts, "name")}
                            </Select>
                        </Form.Item>
                        <Button htmlType="submit" className="w-full">Connect Now</Button>
                    </Form>

                    <h1 className="text-2xl font-bold mt-4">Schedule a Call</h1>
                    <Form
                        name="schedule-call"
                        className="grid grid-cols-2 gap-2 mt-3"
                        onFinish={onScheduleFinish}
                    >
                        <Form.Item
                            name="user"
                            rules={[{ required: true, message: "Please select a user" }]}
                        >
                            <Select
                                className="w-full"
                                showSearch
                                placeholder="Select User"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {generateOptions(users, "name")}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="expert"
                            rules={[{ required: true, message: "Please select an expert" }]}
                        >
                            <Select
                                className="w-full"
                                showSearch
                                placeholder="Select Expert"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {generateOptions(experts, "name")}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="datetime"
                            rules={[{ required: true, message: "Please select a date and time" }]}
                        >
                            <DatePicker
                                className="w-full"
                                format="YYYY-MM-DD HH:mm:ss"
                                showTime
                            />
                        </Form.Item>
                        <Form.Item
                            name="duration"
                            rules={[{ required: true, message: "Please select a duration" }]}
                        >
                            <Select
                                className="w-full"
                                placeholder="Select Duration"
                            >
                                {["30", "60"].map(duration => (
                                    <Option key={duration} value={duration}>
                                        {duration} minutes
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Button htmlType="submit" className="w-full">Schedule Call</Button>
                        {/* {slots.length !== 0 ?
                                <div
                                    style={{ gridColumn: "1 / span 2" }}
                                >
                                    <div className="grid grid-cols-3 gap-2 dark:bg-lightBlack p-2 rounded-xl my-2">
                                        {slots.map(slot => (
                                            <Button
                                                key={slot.label}
                                                className={`w-full my-2 ${selectedSlot === slot ? 'ant-btn-primary' : ''}`}
                                                onClick={() => {
                                                    setSelectedSlot(slot);
                                                    setFSlot([slot.value]);
                                                }}
                                                disabled={!slot.value.available}
                                            >
                                                {slot.label}
                                            </Button>
                                        ))}
                                    </div>
                                    <Button onClick={onFinalSchedule} className="w-full">Schedule</Button>
                                </div>
                                : null
                            } */}
                    </Form>
                </div>
            </div>
        </LazyLoad>
    );
};

export default SchedulerTab;
