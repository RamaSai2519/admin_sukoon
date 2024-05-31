import React from "react";
import { Select, DatePicker, Form, Button, Table, ConfigProvider, theme } from "antd";
import Raxios from "../../../services/axiosHelper";
import { useSchedules, useUsers, useExperts } from "../../../services/useData";
import LazyLoad from "../../../components/LazyLoad/lazyload";

const { Option } = Select;

const SchedulerTab = () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const { schedules } = useSchedules();
    const { users } = useUsers();
    const { experts } = useExperts();

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
            await Raxios.delete(`/service/schedule/${record._id}`);
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

    const onConnectFinish = async values => {
        try {
            const response = await Raxios.post("/call/connect", values);
            console.log(response);
            window.alert("Call Connected successfully");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <LazyLoad>
            <ConfigProvider theme={{
                algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}>
                <div className="mt-2">
                    {/* <div className="flex items-center justify-center">
                    <Form name="connect-call" className="grid grid-cols-4 gap-2 mt-3" onFinish={onConnectFinish}>
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
                        <Button htmlType="submit" style={{ width: "100%" }}>
                            Connect Now
                        </Button>
                    </Form>
                </div> */}

                    <Form name="schedule-call" className="grid grid-cols-4 gap-2 mt-3" onFinish={onScheduleFinish}>
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

                    <div className="m-0">
                        <Table dataSource={schedules.reverse()} columns={columns} />
                    </div>
                </div>
            </ConfigProvider>
        </LazyLoad>
    );
};


export default SchedulerTab;