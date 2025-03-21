import React from 'react';
import LazyLoad from '../LazyLoad/lazyload';
import { Form, Input, InputNumber, Select, DatePicker, Button } from 'antd';

const { RangePicker } = DatePicker;
const { Option } = Select;


const PushNotification = () => {
    // const 


    const formItems1 = [
        { name: 'event_id', label: 'Select Event Slug', type: 'select', options: ['option1', 'option2'] },
        { name: 'call_type', label: 'Select Calls Status', type: 'select', options: ['option1', 'option2'] },
        { name: 'call_with', label: 'Select Experts Type', type: 'select', options: ['option1', 'option2'] },
        { name: 'users_type', label: 'Select Users Type', type: 'select', options: ['option1', 'option2'] },
        { name: 'cities', label: 'Select Cities', type: 'select', options: ['option1', 'option2'] },
        { name: 'users_status', label: 'Select User Status', type: 'select', options: ['option1', 'option2'] },
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
            case 'select':
                return (
                    <Select>
                        {item.options.map(option => (
                            <Option key={option} value={option}>{option}</Option>
                        ))}
                    </Select>
                );
            case 'rangePicker':
                return <RangePicker />;
            case 'text':
                return <Input />;
            case 'textarea':
                return <Input.TextArea />;
            default:
                return null;
        }
    };

    const onFinish = (values) => {
        console.log('Received values:', values);
    };

    return (
        <LazyLoad>
            <div className="py-5 pr-5 w-full flex-col justify-center items-center">
                <Form onFinish={onFinish} layout="vertical" className='flex w-full gap-5'>
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
                        <Form.Item name="text" label="Text" rules={[{ required: true }]}>
                            {renderFormItem({ name: 'joined_range', label: 'User Joined Date', type: 'rangePicker' })}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
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