import React, { useContext } from "react";
import { Select, DatePicker, Form, Button, Table, Checkbox, ConfigProvider, theme } from "antd";
import Raxios from "../../services/axiosHelper";
import { useSchedules, useUsers, useExperts } from "../../services/useData";
import LazyLoad from "../../components/LazyLoad/lazyload";
import Loading from "../../components/Loading/loading";
import { LoadingContext } from "../AdminDashboard";

const SchedulerTab = () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const [slots, setSlots] = React.useState([]);
    const [sValues, setSValues] = React.useState({ user: "", expert: "", datetime: "" });
    const [slot, setSlot] = React.useState([]);
    const { loading } = useContext(LoadingContext);
    const { schedules } = useSchedules();
    const { users } = useUsers();
    const { experts } = useExperts();
    const { Option } = Select;

    const columns = [
        { title: "User", dataIndex: "user", key: "user" },
        { title: "Expert", dataIndex: "expert", key: "expert" },
        { title: "Date & Time", dataIndex: "datetime", key: "datetime" },
        { title: "Status", dataIndex: "status", key: "status" },
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

    const onFinish = async (values, endpoint, successMessage) => {
        try {
            const selectedDateTime = values.datetime;
            const now = new Date();
            if (selectedDateTime && selectedDateTime <= now) {
                window.alert("Selected time has already passed. Please select a future time.");
                return;
            }
            const response = await Raxios.post(endpoint, values);
            if (response.status === 200) {
                if (endpoint === "/data/slots") {
                    setSValues(values);
                    setSlots(response.data.map(slot => ({
                        label: slot.slot,
                        value: slot
                    }))
                    );
                }
            }
            // window.alert(successMessage);
            // window.location.reload();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const onFinalSchedule = async () => {
        if (slot.length === 0) {
            window.alert("Please select a slot to schedule the call");
            return;
        } else if (slot.length > 1) {
            window.alert("Please select only one slot to schedule the call");
            return;
        }

        // Update sValues with the datetime from the selected slot
        const updatedSValues = { ...sValues, datetime: slot[0].datetime };

        try {
            const response = await Raxios.post("/data/schedules", updatedSValues);
            if (response.status === 200) {
                window.alert("Call scheduled successfully");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error scheduling call:", error);
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
                            onFinish={(values) => onFinish(values, "/call/connect", "Call Connected successfully")}
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
                            onFinish={(values) => onFinish(values, "/data/slots", "Call Scheduled successfully")}
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
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                />
                            </Form.Item>
                            <Button htmlType="submit" className="w-full">Get slots</Button>
                            {slots.length !== 0 ?
                                <div
                                    style={{ gridColumn: "1 / span 2" }}
                                >
                                    <Checkbox.Group
                                        className="grid grid-cols-3 gap-2 bg-lightBlack p-2 rounded-xl my-2"
                                        options={slots}
                                        onChange={(values) => setSlot(values)}
                                    />
                                    <Button onClick={onFinalSchedule} className="w-full">Schedule</Button>
                                </div>
                                : null
                            }
                        </Form>
                    </div>
                </div>
            </ConfigProvider>
        </LazyLoad>
    );
};

export default SchedulerTab;
