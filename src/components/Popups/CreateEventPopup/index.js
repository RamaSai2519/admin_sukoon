import React, { useState } from 'react';
import { Form, Input, Button, message, Select, DatePicker, Upload, InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Raxios from '../../../services/axiosHelper';
import dayjs from 'dayjs';
import axios from 'axios';

const CreateEventPopup = ({ setVisible, data, editMode }) => {
    const [uploadedImageUrl, setUploadedImageUrl] = useState(data?.imageUrl || '');

    const handleCreate = async (values) => {
        const { image, ...otherValues } = values;
        try {
            const response = await Raxios.post('/event/handle', {
                ...otherValues,
                imageUrl: uploadedImageUrl
            });
            if (response.status === 200) {
                const fResponse = await axios.post("https://prod-backend.sukoonunlimited.com/api/events/config", {
                    ...otherValues,
                    imageUrl: uploadedImageUrl
                });
                if (fResponse.data.success) {
                    message.success(
                        `Event ${data ? 'updated' : 'created'} successfully`
                    );
                    setVisible(false);
                } else {
                    message.error('Error creating event');
                }
            }
        } catch (error) {
            console.error('Error creating event:', error);
            message.error('Error creating event');
        }
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
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const initialValues = {
        name: data?.name,
        mainTitle: data?.mainTitle,
        subTitle: data?.subTitle,
        hostedBy: data?.hostedBy,
        slug: data?.slug,
        startEventDate: data?.startEventDate ? dayjs(data?.startEventDate) : undefined,
        validUpto: data?.validUpto ? dayjs(data?.validUpto) : undefined,
        eventType: data?.eventType,
        description: data?.description,
        category: data?.category,
        maxVisitorsAllowed: data?.maxVisitorsAllowed,
        prizeMoney: data?.prizeMoney,
        guestSpeaker: data?.guestSpeaker,
        meetingLink: data?.meetingLink,
        repeat: data?.repeat,
        registrationAllowedTill: data?.registrationAllowedTill ? dayjs(data?.registrationAllowedTill) : undefined,
        imageUrl: data?.imageUrl,
        isPremiumUserOnly: data?.isPremiumUserOnly
    };

    const formItems = [
        {
            label: "Created By", name: "name", component: <Input disabled={editMode} />,
            rules: [{ required: true, message: 'Please enter the name' }],
        },
        {
            label: "Main Title", name: "mainTitle", component: <Input />,
            rules: [
                { required: true, message: 'Please enter the main title' },
                { max: 40, message: 'Max length is 50' }
            ],
        },
        { label: "Sub Title", name: "subTitle", rules: [], component: <Input.TextArea /> },
        { label: "Hosted By", name: "hostedBy", rules: [], component: <Input /> },
        {
            label: "Slug", name: "slug", component: <Input disabled={editMode} />,
            rules: [{ required: true, message: 'Please enter the slug' }]
        },
        {
            label: "Start Event Date", name: "startEventDate", rules: [],
            component: <DatePicker className='w-full' format="YYYY-MM-DD HH:mm:ss" showTime />
        },
        {
            label: "Valid Upto", name: "validUpto",
            rules: [{ required: true, message: 'Please select the valid upto' }],
            component: <DatePicker className='w-full' format="YYYY-MM-DD HH:mm:ss" showTime />
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
        { label: "Description", name: "description", rules: [{ max: 125 }], component: <Input.TextArea /> },
        { label: "Category", name: "category", rules: [], component: <Input /> },
        { label: "Max Visitors Allowed", name: "maxVisitorsAllowed", rules: [], component: <InputNumber className='w-full' /> },
        { label: "Prize Money", name: "prizeMoney", rules: [], component: <InputNumber className='w-full' /> },
        {
            label: "Guest Speaker", name: "guestSpeaker", component: <Input />,
            rules: [{ required: true, message: 'Please select the guest speaker' }],
        },
        { label: "Meeting Link", name: "meetingLink", rules: [], component: <Input /> },
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
        {
            label: "Registration Allowed Till", name: "registrationAllowedTill", rules: [],
            component: <DatePicker className='w-full' format="YYYY-MM-DD HH:mm:ss" showTime />
        },
        {
            label: "Premium Users Only", name: "isPremiumUserOnly", rules: [{ required: true, message: 'Please select an option' }],
            component:
                <Select placeholder="Select a option">
                    <Select.Option value={true}>Yes</Select.Option>
                    <Select.Option value={false}>No</Select.Option>
                </Select>
        },
        {
            label: "Image",
            name: "image",
            rules: [{ required: true, message: 'Please upload the image' }],
            component: (
                <div>
                    <img src={uploadedImageUrl || data?.imageUrl} alt='Event' />
                    <Upload
                        action="https://rama.sukoonunlimited.com/admin/service/upload"
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />} className='w-full mt-2'>Edit Image</Button>
                    </Upload>
                </div>
            )
        }
    ];

    return (
        <div className='min-h-screen flex py-5 overflow-auto w-full'>
            <div className='w-full'>
                {!data && <div className='flex justify-end mb-5'>
                    <Button onClick={() => setVisible(false)} type="primary">Close</Button>
                </div>}
                <Form
                    onFinish={handleCreate}
                    layout="vertical"
                    initialValues={initialValues}
                    className='w-full grid md:grid-cols-4 gap-4 justify-center'
                >
                    {formItems.map(item => (
                        <Form.Item
                            key={item.name}
                            label={item.label}
                            name={item.name}
                            rules={data ? [] : item.rules}
                            className='h-full'
                        >
                            {item.component}
                        </Form.Item>
                    ))}
                    <Form.Item style={{ gridColumn: "4" }}>
                        <div className='flex justify-end items-end'>
                            <Button type="primary" htmlType="submit">
                                {data ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default CreateEventPopup;
