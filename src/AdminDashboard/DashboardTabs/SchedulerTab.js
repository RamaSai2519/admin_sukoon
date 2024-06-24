import React, { useEffect } from "react";
import { Select, DatePicker, Form, Button, Table, ConfigProvider, theme } from "antd";
import Raxios from "../../services/axiosHelper";
import { useSchedules, useUsers, useExperts } from "../../services/useData";
import LazyLoad from "../../components/LazyLoad/lazyload";
import Loading from "../../components/Loading/loading";

const SchedulerTab = () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    // const [slots, setSlots] = React.useState([]);
    // const [sValues, setSValues] = React.useState({ user: "", expert: "", datetime: "" });
    // const [fslot, setFSlot] = React.useState([]); // Final slot state
    // const [selectedSlot, setSelectedSlot] = React.useState(null); // Selected slot state
    const [loading, setLoading] = React.useState(false);
    const { schedules, fetchSchedules } = useSchedules();
    const { users, fetchUsers } = useUsers();
    const { experts, fetchExperts } = useExperts();
    const { Option } = Select;

    useEffect(() => {
        setLoading(true);
        fetchSchedules();
        fetchUsers();
        fetchExperts();
        setLoading(false);
        // eslint-disable-next-line
    }, []);

    const columns = [
        { title: "User", dataIndex: "user", key: "user" },
        { title: "Expert", dataIndex: "expert", key: "expert" },
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

    const generateOptions = (data, key) => data.map(item => (
        <Option key={item._id} value={item._id}>
            {item[key]}
        </Option>
    ));

    const onFinish = async (values, endpoint) => {
        try {
            const response = await Raxios.post(endpoint, {
                ...values,
                type: "Admin"
            });
            if (response.status === 200) {
                window.alert("Call connected successfully");
                // if (endpoint === "/data/slots") {
                //     setSValues(values);
                //     setSlots(response.data.map(slot => ({
                //         label: slot.slot,
                //         value: slot
                //     })));
                // }
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const onScheduleFinish = async values => {
        try {
            const selectedDateTime = values.datetime;
            const now = new Date();
            if (selectedDateTime <= now) {
                window.alert("Selected time has already passed. Please select a future time.");
            } else {
                await Raxios.post("/data/schedules", values);
                window.alert("Call Scheduled successfully");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <LazyLoad>
            <ConfigProvider theme={{
                algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}>
                <div className="flex items-center justify-center gap-4 h-full">
                    <div className="w-3/4">
                        {loading ? <Loading /> :
                            <Table dataSource={schedules.reverse()} columns={columns} />
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
            </ConfigProvider>
        </LazyLoad>
    );
};

export default SchedulerTab;
