import React, { useEffect, useState } from 'react';
import Loading from '../Loading/loading';
import LazyLoad from '../LazyLoad/lazyload';
import { generateNewOptions } from '../../Utils/antSelectHelper';
import { MaxiosPost, raxiosFetchData } from '../../services/fetchData';
import { Form, Input, InputNumber, Select, DatePicker, Button } from 'antd';

const { RangePicker } = DatePicker;

const PushNotification = () => {
    const [form] = Form.useForm();
    const [slugs, setSlugs] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [usersCount, setUsersCount] = useState(null);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [userStatusOptions, setUserStatusOptions] = useState([]);

    const fetchData = async () => {
        await raxiosFetchData(null, null, setUserStatusOptions, null, '/actions/user_status_options', null, setLoading);
        const data = await raxiosFetchData(null, null, null, null, '/actions/wa_options', { type: 'form' }, setLoading);
        if (data) { setSlugs(data.slugs); setCities(data.cities); }
    };

    useEffect(() => { fetchData() }, []);


    const formItems1 = [
        { name: 'event_id', label: 'Select Event Slug', type: 'select_events', options: slugs },
        { name: 'call_type', label: 'Select Calls Status', type: 'select', options: ['successful', 'inadequate', 'missed', 'failed'] },
        { name: 'call_with', label: 'Select Experts Type', type: 'select', options: ['expert', 'saarthi', 'internal'] },
        { name: 'users_type', label: 'Select Users Type', type: 'select', options: ['users', 'leads'] },
        { name: 'cities', label: 'Select Cities', type: 'multiple_select', options: cities },
        { name: 'users_status', label: 'Select User Status', type: 'statusOptions', options: userStatusOptions },
    ];

    const formItems2 = [
        { name: 'number_of_calls', label: 'Number of Calls', type: 'number' },
        { name: 'days_since_last_call', label: 'Days Since Last Call', type: 'number' },
        { name: 'number_of_events', label: 'Number of Events', type: 'number' },
        { name: 'days_since_last_event', label: 'Days Since Last Event', type: 'number' },
    ];

    const formItems3 = [
        { name: 'title', label: 'Title', type: 'text', rules: [{ required: true }] },
        { name: 'body', label: 'Body', type: 'textarea', rules: [{ required: true }] }
    ];

    const renderFormItem = (item) => {
        switch (item.type) {
            case 'number':
                return <InputNumber />;
            case 'statusOptions':
                return <Select className='w-full' options={userStatusOptions} />
            case 'select':
                return (
                    <Select
                        allowClear showSearch
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {item.options.map((option, index) => (
                            <Select.Option key={index} value={option}>{option}</Select.Option>
                        ))}
                    </Select>
                );
            case 'select_events':
                return (
                    <Select
                        allowClear showSearch
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {generateNewOptions(item.options, 'slug')}
                    </Select>
                );
            case 'multiple_select':
                return (
                    <Select
                        mode="multiple"
                        allowClear showSearch
                        optionFilterProp='children'
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {item.options.map((option, index) => (
                            <Select.Option key={index} value={option}>{option}</Select.Option>
                        ))}
                    </Select>
                );
            case 'rangePicker':
                return <RangePicker />;
            case 'text':
                return <Input />;
            case 'textarea':
                return <Input.TextArea rows={20} />;
            default:
                return null;
        }
    };

    const prep_payload = (payload) => {
        payload.action = 'preview';
        if (!payload.body || !payload.title) {
            payload.body = 'This is a test body';
            payload.title = 'This is a test title';
        }
        if (payload.event_id) { payload.event_id = slugs.find(slug => slug._id === payload.event_id).slug; }
        if (payload.joined_range) {
            payload.join_date_start = payload.joined_range[0]
            payload.join_date_end = payload.joined_range[1]
            delete payload.joined_range
        }
        return payload;
    };

    const onFinish = (values) => {
        const payload = prep_payload(values);
        payload.action = 'send';
        MaxiosPost('/flask/send_fcm_msgs', payload, true, setButtonLoading);
    };

    const getPreview = async () => {
        const values = form.getFieldsValue();
        const payload = prep_payload(values);
        console.log("🚀 ~ getPreview ~ payload:", payload)
        const response = await MaxiosPost('/flask/send_fcm_msgs', payload, false, setButtonLoading);
        if (response) { setUsersCount(response.data.count); }
    };


    if (loading) return <Loading />;

    return (
        <LazyLoad>
            <div className="py-5 pr-5 w-full flex-col justify-center items-center">
                <Form form={form} onFinish={onFinish} layout="vertical" className='flex w-full gap-5'>
                    <div className='w-1/2'>
                        <div className='grid grid-cols-2 gap-2'>
                            {formItems2.map(item => (
                                <Form.Item key={item.name} name={item.name} label={item.label} rules={item.rules}>
                                    {renderFormItem(item)}
                                </Form.Item>
                            ))}
                        </div>
                        <div className='grid grid-cols-2 gap-2'>
                            {formItems1.map(item => (
                                <Form.Item key={item.name} name={item.name} label={item.label} rules={item.rules}>
                                    {renderFormItem(item)}
                                </Form.Item>
                            ))}
                        </div>
                        <Form.Item name="joined_range" label="User Joined Date">
                            {renderFormItem({ name: 'joined_range', label: 'User Joined Date', type: 'rangePicker' })}
                        </Form.Item>
                        <Form.Item>
                            <div className='flex justify-between items-center'>
                                <div className='flex gap-2 items-center'>
                                    <Button type="primary" onClick={getPreview} loading={buttonLoading}>
                                        Preview
                                    </Button>
                                    {usersCount &&
                                        <span className='text-sm'>This notification will be sent to <b>{usersCount}</b> users</span>
                                    }
                                </div>
                                <Button type="primary" htmlType="submit" loading={buttonLoading}>
                                    Submit
                                </Button>
                            </div>
                        </Form.Item>
                    </div>
                    <div className='w-1/2'>
                        {formItems3.map(item => (
                            <Form.Item key={item.name} name={item.name} label={item.label} rules={item.rules}>
                                {renderFormItem(item)}
                            </Form.Item>
                        ))}
                    </div>
                </Form>
            </div>
        </LazyLoad>
    );
};

export default PushNotification;