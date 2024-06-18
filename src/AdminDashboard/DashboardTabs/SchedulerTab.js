import React from "react";
import { Select, DatePicker, Form, Button, Table, Checkbox, ConfigProvider, theme } from "antd";
import Raxios from "../../services/axiosHelper";
import { useSchedules, useUsers, useExperts } from "../../services/useData";
import LazyLoad from "../../components/LazyLoad/lazyload";
import Loading from "../../components/Loading/loading";
import { LoadingContext } from "../AdminDashboard";

const SchedulerTab = () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const { loading } = React.useContext(LoadingContext);
    const { schedules } = useSchedules();
    const { users } = useUsers();
    const { experts } = useExperts();
    const { Option } = Select;

    const slots = [
        '15:00 - 15:30',
        '15:30 - 16:00',
        '16:00 - 16:30',
        '16:30 - 17:00',
        '17:00 - 17:30',
        '17:30 - 18:00',
        '18:00 - 18:30',
        '18:30 - 19:00',
        '19:00 - 19:30',
        '19:30 - 20:00'
    ];

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
            title: "Status",
            dataIndex: "status",
            key: "status",
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
                <div className="flex items-center justify-center gap-4 h-full ">
                    <div className="w-3/4">
                        {loading ? <Loading /> :
                            <Table dataSource={schedules.reverse()} columns={columns} />
                        }
                    </div>
                    <div className="flex flex-col h-full border-l-2 dark:border-lightBlack pl-2 justify-center">
                        <h1 className="text-2xl font-bold mb-3">Connect a Call</h1>
                        <Form name="connect-call" className="grid grid-cols-2 gap-2 w-full border-b-2 dark:border-lightBlack pb-4" onFinish={onConnectFinish}>
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
                                    className="w-full"
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
                                    className="w-full"
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
                            <Button htmlType="submit" className="w-full">
                                Connect Now
                            </Button>
                        </Form>

                        <h1 className="text-2xl font-bold mt-4">Schedule a Call</h1>
                        <Form name="schedule-call" className="grid grid-cols-2 gap-2 mt-3" onFinish={onScheduleFinish}>
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
                                    className="w-full"
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
                                    className="w-full"
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
                                    className="w-full"
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    onInput={(e) => console.log(e)}
                                />
                            </Form.Item>
                            {/* {slots &&
                                <Checkbox.Group className="grid grid-cols-3 gap-2 bg-lightBlack p-2 rounded-xl my-2" style={{ "gridColumn": "1 / span 2" }} options={slots} />
                            } */}
                            <Button htmlType="submit" className="w-full">
                                Schedule
                            </Button>
                        </Form>
                        <div>
                            {/* <h1 className="text-2xl font-bold mt-4">Available Slots</h1> */}
                            {/* <div className="grid gap-2 mt-3">
                                {slots.map(slot => (
                                    <div key={slot} className="w-fit p-2 rounded-xl border-2 dark:border-lightBlack">
                                        {slot}
                                    </div>
                                ))}
                            </div> */}
                        </div>
                    </div>
                </div>
            </ConfigProvider>
        </LazyLoad>
    );
};


export default SchedulerTab;