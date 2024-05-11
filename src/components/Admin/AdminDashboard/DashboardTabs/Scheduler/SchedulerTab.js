import React from "react";
import { Select, DatePicker, Form, Button, Table, ConfigProvider, theme } from "antd";
import Raxios from "../../../../../services/axiosHelper";
import { useData } from "../../../../../services/useData";

const { Option } = Select;

const SchedulerTab = () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const { users, experts, schedules } = useData();

    const columns = [
        {
            title: "User",
            dataIndex: "user",
            key: "user",
        },
        {
            title: "Expert",
            dataIndex: "expert",
            key: "expert",
        },
        {
            title: "Date & Time",
            dataIndex: "datetime",
            key: "datetime",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) =>
                <>

                    <Button onClick={() => handleDelete(record)}>Delete</Button>
                </>
        },
    ];

    const handleDelete = async (record) => {
        try {
            await Raxios.delete(`/api/schedule/${record._id}`);
            window.alert("Schedule deleted successfully");
            window.location.reload();
        } catch (error) {
            console.error("Error deleting schedule:", error);
        }
    };


    const userOptions = users.map(user => (
        <Option key={user._id} value={user._id}>
            {user.name}
        </Option>
    ));

    const expertOptions = experts.map(expert => (
        <Option key={expert._id} value={expert._id}>
            {expert.name}
        </Option>
    ));

    const onFinish = async values => {
        try {
            const selectedDateTime = values.datetime;
            const now = new Date();
            if (selectedDateTime <= now) {
                window.alert("Selected time has already passed. Please select a future time.");
            } else {
                await Raxios.post("/api/schedule", values);
                window.alert("Call Scheduled successfully");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <ConfigProvider theme={{
            algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}>
            <div className="scheduler-tab">
                <Form name="schedule-call" className="scheduler-grid-row" onFinish={onFinish}>
                    <Form.Item
                        name={"user"}
                        rules={[
                            {
                                required: true,
                                message: "Please select a user",
                            },
                        ]}
                    >
                        <Select
                            id="user"
                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Select User"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {userOptions}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        className="m-0"
                        name={"expert"}
                        rules={[
                            {
                                required: true,
                                message: "Please select an expert",
                            },
                        ]}
                    >
                        <Select
                            id="expert"
                            style={{ width: "100%" }}
                            showSearch
                            placeholder="Select Expert"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children && option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {expertOptions}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        className="m-0"
                        name={"datetime"}
                        rules={[
                            {
                                required: true,
                                message: "Please select a date and time",
                            },
                        ]}
                    >
                        <DatePicker
                            id="datetime"
                            style={{ width: "100%" }}
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                        />
                    </Form.Item>

                    <Button htmlType="submit" style={{ width: "100%" }}>
                        Schedule
                    </Button>
                </Form>

                <div className="schedules-table">
                    <Table dataSource={schedules.reverse()} columns={columns} />
                </div>
            </div>
        </ConfigProvider>
    );
};


export default SchedulerTab;