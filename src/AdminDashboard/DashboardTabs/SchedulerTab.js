import { Select, DatePicker, Form, Button, Table, message } from "antd";
import { useUsers, useExperts } from "../../services/useData";
import { generateOptions } from "../../Utils/antSelectHelper";
import getColumnSearchProps from "../../Utils/antTableHelper";
import InternalToggle from "../../components/InternalToggle";
import React, { useEffect, useRef, useState } from "react";
import LazyLoad from "../../components/LazyLoad/lazyload";
import Loading from "../../components/Loading/loading";
import { formatTime } from "../../Utils/formatHelper";
import { RaxiosPost } from "../../services/fetchData";
import Raxios from "../../services/axiosHelper";

const SchedulerTab = () => {
    // const [slots, setSlots] = useState([]);
    // const [sValues, setSValues] = useState({ user: "", expert: "", datetime: "" });
    // const [fslot, setFSlot] = useState([]); // Final slot state
    // const [selectedSlot, setSelectedSlot] = useState(null); // Selected slot state

    const searchInputRef = useRef(null);
    const { users, fetchUsers } = useUsers();
    const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const { experts, fetchExperts } = useExperts();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [responseLoading, setResponseLoading] = useState(false);
    const [internalView, setInternalView] = useState(
        localStorage.getItem('internalView') === 'true' ? true : false
    );
    const { Option } = Select;

    const fetchSchedules = async () => {
        setLoading(true);
        const response = await RaxiosPost('/schedules', { action: 'get' });
        setSchedules(response.data.data);
        setLoading(false);
    }

    useEffect(() => {
        fetchSchedules();

    }, []);

    const fetchUsersAndExperts = async () => {
        setDisable(true);
        await fetchUsers();
        await fetchExperts(internalView);
        setDisable(false);
    };

    useEffect(() => {
        fetchUsersAndExperts();
        // eslint-disable-next-line
    }, [internalView]);

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
        createColumn("Status", "status", "status"),
        {
            title: "Action", key: "action",
            render: (_, record) => {
                if (record.isDeleted) {
                    return <Button disabled>Deleted</Button>;
                } else {
                    return <Button loading={responseLoading} onClick={() => handleDelete(record)}>Delete</Button>
                }
            }
        },
    ];

    const handleDelete = async (record) => {
        setResponseLoading(true);
        try {
            await RaxiosPost('/schedules', {
                scheduleId: record.id,
                action: 'delete'
            }, true);
            window.location.reload();
        } catch (error) {
            console.error("Error deleting schedule:", error);
        }
        setResponseLoading(false);
    };

    const handleCallTrigger = async (values, endpoint, type_) => {
        setResponseLoading(true);
        try {
            const response = await Raxios.post(endpoint, {
                user_id: values.user,
                expert_id: values.expert, type_
            });
            if (response.status !== 200) {
                message.error(response.msg);
            } else {
                message.success(response.msg);
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'An error occurred');
        }
        setResponseLoading(false);
    };

    const onScheduleFinish = async values => {
        setResponseLoading(true);
        try {
            const selectedDateTime = values.datetime;
            const now = new Date();
            if (selectedDateTime <= now) {
                window.alert("Selected time has already passed. Please select a future time.");
            } else {
                await RaxiosPost('/schedules', {
                    ...values,
                    type: "Admin",
                    action: 'create'
                }, true);
                window.location.reload();
            }
        } catch (error) {
            console.error("Error:", error);
        }
        setResponseLoading(false);
    };

    return (
        <LazyLoad>
            <div className="flex items-center justify-center gap-4 h-full">
                <div className="w-3/4">
                    {loading ? <Loading /> :
                        <div className="flex flex-col gap-2">
                            <Table
                                scroll={{ x: 768 }}
                                rowKey={(record) => record._id}
                                dataSource={schedules}
                                columns={columns}
                            />
                        </div>
                    }
                </div>
                <div className="flex flex-col h-full border-l-2 dark:border-lightBlack pl-2 justify-center">
                    <div className="flex w-full justify-between">
                        <h1 className="text-2xl font-bold mb-3">Connect a Call</h1>
                        <InternalToggle internalView={internalView} setInternalView={setInternalView} disable={disable} />
                    </div>
                    <Form
                        name="connect-call"
                        className="grid grid-cols-2 gap-2 w-full border-b-2 dark:border-lightBlack pb-4"
                        onFinish={(values) => handleCallTrigger(values, "/call", "call")}
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
                        <Button loading={responseLoading} htmlType="submit" className="w-full">Connect Now</Button>
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
                        <Button loading={responseLoading} htmlType="submit" className="w-full">Schedule Call</Button>
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
