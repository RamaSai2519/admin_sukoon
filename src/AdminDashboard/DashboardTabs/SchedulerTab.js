import { Select, DatePicker, Form, Button, Table } from "antd";
import { useUsers, useExperts } from "../../services/useData";
import LazyLoad from "../../components/LazyLoad/lazyload";
import Loading from "../../components/Loading/loading";
import { fetchFilteredData, fetchPagedData } from "../../services/fetchData";
import Raxios from "../../services/axiosHelper";
import { generateOptions } from "../../Utils/antSelectHelper";
import React, { useEffect, useState } from "react";
import { handleFilterDropdownVisibleChange } from "../../Utils/antTableHelper";

const SchedulerTab = () => {
    // const [slots, setSlots] = useState([]);
    // const [sValues, setSValues] = useState({ user: "", expert: "", datetime: "" });
    // const [fslot, setFSlot] = useState([]); // Final slot state
    // const [selectedSlot, setSelectedSlot] = useState(null); // Selected slot state

    const [currentPage, setCurrentPage] = useState(
        localStorage.getItem('scurrentPage') ? parseInt(localStorage.getItem('scurrentPage')) : 1
    );
    const [totalItems, setTotalItems] = useState(0);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState({});
    const [selectedFilters, setSelectedFilters] = useState({});
    const [filterOn, setFilterOn] = useState(false);
    const { experts, fetchExperts } = useExperts();
    const { users, fetchUsers } = useUsers();
    const { Option } = Select;

    useEffect(() => {
        if (filterOn) {
            fetchFilteredData(currentPage, pageSize, setCurrentPage, setPageSize, setSchedules, setTotalItems, setLoading, selectedFilters, 'schedules');
        } else {
            fetchPagedData(currentPage, pageSize, setSchedules, setTotalItems, setLoading, '/data/schedules');
        }
    }, [currentPage, pageSize, filterOn, selectedFilters]);

    useEffect(() => {
        setLoading(true);
        fetchUsers();
        fetchExperts();
        setLoading(false);
        // eslint-disable-next-line
    }, []);

    const handleTableChange = (pagination, filters, sorter) => {
        localStorage.setItem('scurrentPage', pagination.current);
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
        if ((filters.user || filters.expert) && (filters !== selectedFilters)) {
            setSelectedFilters(filters);
            setFilterOn(true);
        }
    };

    const columns = [
        {
            title: "User", dataIndex: "user", key: "user", filters: filters.user, filterSearch: true, filteredValue: selectedFilters.user,
            filterDropdownVisibleChange: handleFilterDropdownVisibleChange('users', 'name', 'user', setFilters, filters),
        },
        {
            title: "Expert", dataIndex: "expert", key: "expert", filters: filters.expert || [], filterSearch: true, filteredValue: selectedFilters.expert,
            filterDropdownVisibleChange: handleFilterDropdownVisibleChange('experts', 'name', 'expert', setFilters, filters),
        },
        { title: "Date & Time", dataIndex: "datetime", key: "datetime" },
        { title: "Status", dataIndex: "status", key: "status" },
        { title: "Scheduled By", dataIndex: "type", key: "type" },
        {
            title: "Action", key: "action",
            render: (_, record) => <Button onClick={() => handleDelete(record)}>Delete</Button>
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

    const handleResetFilters = () => {
        setFilterOn(false);
        setFilters({});
        setSelectedFilters({});
    };

    return (
        <LazyLoad>
            <div className="flex items-center justify-center gap-4 h-full">
                <div className="w-3/4">
                    {loading ? <Loading /> :
                        <div className="flex flex-col gap-2">
                            {filterOn && <div className="flex justify-end"><Button onClick={handleResetFilters} className="w-fit">Reset Filters</Button></div>}
                            <Table
                                rowKey={(record) => record._id}
                                pagination={{
                                    current: currentPage,
                                    pageSize: pageSize,
                                    total: totalItems,
                                }}
                                onChange={handleTableChange}
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
