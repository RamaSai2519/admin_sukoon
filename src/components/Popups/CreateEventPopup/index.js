import React, { useState } from 'react';
import dayjs from 'dayjs';
import S3Uploader from '../../Upload';
import { RaxiosPost } from '../../../services/fetchData';
import { Form, Input, Button, message, Select, DatePicker, InputNumber } from 'antd';

const CreateEventPopup = ({ setVisible, data, editMode }) => {
    const [uploadedImageUrl, setUploadedImageUrl] = useState(data?.imageUrl || '');

    const handleCreate = async (values) => {
        const { image, ...otherValues } = values;
        if (!uploadedImageUrl) { message.error('Please upload an image'); return; }
        const response = await RaxiosPost('/upsert_event', {
            ...otherValues,
            imageUrl: uploadedImageUrl
        });
        if (response.status === 200) {
            message.success(response.msg);
            setVisible(false);
        } else {
            message.error(response.msg);
        }
    };

    const initialValues = {
        name: localStorage.getItem("adminName"),
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
            label: "Created By", name: "name", component: <Input disabled={true} />,
            rules: [{ required: true, message: 'Please enter the name' }],
        },
        {
            label: "Main Title", name: "mainTitle", component: <Input />,
            rules: [
                { required: true, message: 'Please enter the main title' },
                { max: 40, message: 'Max length is 40' }
            ],
        },
        {
            label: "Sub Title", name: "subTitle", rules: [
                { max: 130, message: 'Max length is 130' }
            ], component: <Input.TextArea />
        },
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
        {
            label: "Category", name: "category", rules: [
                { required: true, message: 'Please select the category' }
            ], component: (
                <Select>
                    <Select.Option value="support_groups">Support Groups</Select.Option>
                    <Select.Option value="active_together">Active Together</Select.Option>
                    <Select.Option value="wellness_connect">Wellness Connect</Select.Option>
                </Select>
            )
        },
        { label: "Max Visitors Allowed", name: "maxVisitorsAllowed", rules: [], component: <InputNumber className='w-full' /> },
        { label: "Prize Money", name: "prizeMoney", rules: [], component: <InputNumber className='w-full' /> },
        {
            label: "Guest Speaker", name: "guestSpeaker", component: <Input />,
            rules: [{ required: true, message: 'Please select the guest speaker' }],
        },
        { label: "Meeting Link", name: "meetingLink", rules: [], component: <Input /> },
        { label: "Meeting ID", name: "meeting_id", rules: [], component: <Input /> },
        { label: "Meeting Passcode", name: "passcode", rules: [], component: <Input /> },
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
        { label: "Image", name: "image", component: <S3Uploader setFileUrl={setUploadedImageUrl} finalFileUrl={uploadedImageUrl} /> }
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
