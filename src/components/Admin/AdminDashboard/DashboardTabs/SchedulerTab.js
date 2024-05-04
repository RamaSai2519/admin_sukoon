import React, {useState, useEffect} from "react";
import { Select, DatePicker, Form, Button } from "antd";
import useUserManagement from "../../../../services/useUserManagement";
import useExpertManagement from "../../../../services/useExpertManagement";
import axios from "axios";
import { Table } from "antd";

const { Option } = Select;

const SchedulerTab = () => {
    const { users } = useUserManagement();
    const { experts } = useExpertManagement();
    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const schedulesResponse = await axios.get("http://127.0.0.1:80/api/schedule");
                setDataSource(schedulesResponse.data.map(schedule => ({
                    ...schedule,
                    key: schedule._id
                })));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

    const columns = [
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
        },
        {
            title: 'Expert',
            dataIndex: 'expert',
            key: 'expert',
        },
        {
            title: 'Date & Time',
            dataIndex: 'datetime',
            key: 'datetime',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button>Edit</Button>
            ),
        },
    ];

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

    const onFinish = async (values) => {
        try {
            const datetime = values.datetime;
            console.log('Success:', { ...values, datetime });
            await axios.post('http://127.0.0.1:80/api/schedule', { ...values, datetime });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>

            <Form name="schedule-call" className="grid grid-row grid-cols-4 gap-2 p-2 m-0 items-center" onFinish={onFinish}>

                <Form.Item className="m-0" name={'user'} rules={[{
                    required: true,
                    message: 'Please select a user'
                }]}>
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
                <Form.Item className="m-0" name={'expert'} rules={[{
                    required: true,
                    message: 'Please select an expert'
                }]}>
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


                <Form.Item className="m-0" name={'datetime'} rules={[{
                    required: true,
                    message: 'Please select a date and time'
                }]}>
                    <DatePicker
                        id="datetime"
                        style={{ width: "100%" }}
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                    />
                </Form.Item>


                <Button htmlType="submit" style={{ width: "100%" }}>Schedule</Button>

            </Form>

            <div>
                <Table dataSource={dataSource} columns={columns} />
            </div>

        </div>
    );
};

export default SchedulerTab;
