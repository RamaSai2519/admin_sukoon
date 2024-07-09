import React from 'react';
import { Form, Input, Button, message, Select, DatePicker, Upload, InputNumber } from 'antd';
import Raxios from '../../../services/axiosHelper';
import { PlusOutlined } from '@ant-design/icons';

const CreateEventPopup = ({ setVisible }) => {
    const [uploadedImageUrl, setUploadedImageUrl] = React.useState('');
    const [ready, setReady] = React.useState(false);

    const handleCreate = (values) => {
        const { image, ...otherValues } = values;
        Raxios.post('/event/event', {
            ...otherValues,
            imageUrl: uploadedImageUrl
        })
            .then(response => {
                message.success(response.data.message);
                setVisible(false);
            })
            .catch(error => {
                console.error('Error creating event:', error);
                alert('Error creating event:', error);
            });
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
            return Upload.LIST_IGNORE;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
            return Upload.LIST_IGNORE;
        }
        return true;
    };

    const handleChange = (info) => {
        if (info.file.status === 'done') {
            setUploadedImageUrl(info.file.response.file_url);
            message.success(`${info.file.name} file uploaded successfully`);
            setReady(true);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const formItems = [
        {
            label: "Created By", name: "name", component: <Input />,
            rules: [{ required: true, message: 'Please enter the name' }],
        },
        {
            label: "Main Title", name: "mainTitle", component: <Input />,
            rules: [{ required: true, message: 'Please enter the main title' }],
        },
        { label: "Sub Title", name: "subTitle", rules: [], component: <Input /> },
        { label: "Hosted By", name: "hostedBy", rules: [], component: <Input /> },
        {
            label: "Slug", name: "slug", component: <Input />,
            rules: [{ required: true, message: 'Please enter the slug' }]
        },
        {
            label: "Start Event Date", name: "startEventDate", rules: [],
            component: <DatePicker className='w-full' />
        },
        {
            label: "Valid Upto", name: "validUpto",
            rules: [{ required: true, message: 'Please select the valid upto' }],
            component: <DatePicker className='w-full' />
        },
        {
            label: "Event Type", name: "eventType",
            rules: [{ required: true, message: 'Please select the event type' }],
            component: (
                <Select>
                    <Select.Option value="online">Online</Select.Option>
                    <Select.Option value="offline">Offline</Select.Option>
                    <Select.Option value="not_event">Not Event</Select.Option>
                    <Select.Option value="challenge">Challenge</Select.Option>
                </Select>
            )
        },
        { label: "Description", name: "description", rules: [], component: <Input.TextArea /> },
        { label: "Category", name: "category", rules: [], component: <Input /> },
        { label: "Max Visitors Allowed", name: "maxVisitorsAllowed", rules: [], component: <InputNumber className='w-full' /> },
        { label: "Prize Money", name: "prizeMoney", rules: [], component: <InputNumber className='w-full' /> },
        {
            label: "Guest Speaker", name: "guestSpeaker", component: <Input />,
            rules: [{ required: true, message: 'Please select the guest speaker' }],
        },
        {
            label: "Meeting Link", name: "meetingLink", rules: [], component: <Input />
        },
        {
            label: "Repeat", name: "repeat",
            rules: [{ required: true, message: 'Please select the repeat' }],
            component: (
                <Select>
                    <Select.Option value="once">Once</Select.Option>
                    <Select.Option value="daily">Daily</Select.Option>
                    <Select.Option value="weekly">Weekly</Select.Option>
                    <Select.Option value="monthly">Monthly</Select.Option>
                </Select>
            )
        },
        { label: "Registration Allowed Till", name: "registrationAllowedTill", rules: [], component: <DatePicker className='w-full' /> },
        {
            label: "Image",
            name: "image",
            rules: [{ required: true, message: 'Please upload the image' }],
            component: (
                <Upload
                    name="file"
                    listType="picture-card"
                    className="avatar-uploader"
                    action="https://rama.sukoonunlimited.com/admin/service/upload"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    maxCount={1}
                >
                    <PlusOutlined />
                </Upload>
            )
        }
    ];

    return (
        <div className='min-h-screen flex py-5 overflow-auto w-full'>
            <div className='w-full'>
                <div className='flex justify-end mb-5'>
                    <Button onClick={() => setVisible(false)} type="primary">
                        Close
                    </Button>
                </div>
                <Form
                    onFinish={handleCreate}
                    layout="vertical"
                    className='w-full grid md:grid-cols-4 gap-4 justify-center items-center'
                >
                    {formItems.map(item => (
                        <Form.Item
                            key={item.name}
                            label={item.label}
                            name={item.name}
                            rules={item.rules}
                        >
                            {item.component}
                        </Form.Item>
                    ))}
                    <Form.Item style={{ "gridColumn": "4" }}>
                        <div className='flex justify-end items-end'>
                            <Button type="primary" htmlType="submit" disabled={!ready}>
                                Create
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default CreateEventPopup;
