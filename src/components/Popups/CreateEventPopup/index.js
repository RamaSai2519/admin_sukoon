import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import S3Uploader from '../../Upload';
import { useAdmin } from '../../../contexts/useData';
import { RaxiosPost } from '../../../services/fetchData';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Form, Input, Button, message, Select, DatePicker, InputNumber } from 'antd';

const CreateEventPopup = ({ setVisible, data, editMode, contribute }) => {
    const { admin } = useAdmin();
    const [form] = Form.useForm();
    const [uploadedImageUrl, setUploadedImageUrl] = useState(data?.image || data?.imageUrl || '');

    useEffect(() => {
        form.setFieldsValue(
            contribute
                ? {
                    slug: data?.slug,
                    name: data?.name,
                    image: data?.image,
                    email: data?.email,
                    company: data?.company,
                    website: data?.website,
                    stipend: data?.stipend,
                    isPaid: data?.isPaid,
                    highlights: data?.highlights,
                    isDeleted: data?.isDeleted,
                    phoneNumber: data?.phoneNumber,
                    description: data?.description,
                    locationType: data?.locationType,
                    validUpto: data?.validUpto ? dayjs(data?.validUpto) : undefined,
                    startDate: data?.startDate ? dayjs(data?.startDate) : undefined,
                }
                : {
                    name: admin.name,
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
                    isPremiumUserOnly: data?.isPremiumUserOnly,
                }
        );
        setUploadedImageUrl(data?.image || data?.imageUrl || '');
    }, [data, admin, form, contribute]);

    const handleCreate = async (values) => {
        const { image, ...otherValues } = values;
        if (!uploadedImageUrl) { message.error('Please upload an image'); return; }
        const endpoint = `/actions/${contribute ? 'upsert_contribute' : 'upsert_event'}`;
        const response = await RaxiosPost(endpoint, {
            ...otherValues,
            // imageUrl: uploadedImageUrl
            ...(!contribute ? { imageUrl: uploadedImageUrl } : { image: uploadedImageUrl })
        });
        if (response.status === 200) {
            message.success(response.msg);
            setVisible(false);
        } else {
            message.error(response.msg);
        }
    };

    const createFormItem = (label, name, component, rules) => ({ label, name, component, rules });

    const standardEventItems = [
        createFormItem("Created By", "name", <Input disabled={true} />, [{ required: true, message: 'Please enter the name' }]),
        createFormItem("Main Title", "mainTitle", <Input />, [
            { required: true, message: 'Please enter the main title' },
            { max: 40, message: 'Max length is 40' }
        ]),
        createFormItem("Sub Title", "subTitle", <Input.TextArea />, [{ max: 130, message: 'Max length is 130' }]),
        createFormItem("Hosted By", "hostedBy", <Input />, []),
        createFormItem("Slug", "slug", <Input disabled={editMode} />, [{ required: true, message: 'Please enter the slug' }]),
        createFormItem("Start Event Date", "startEventDate", <DatePicker className='w-full' format="YYYY-MM-DD HH:mm:ss" showTime />, []),
        createFormItem("Valid Upto", "validUpto", <DatePicker className='w-full' format="YYYY-MM-DD HH:mm:ss" showTime />, [{ required: true, message: 'Please select the valid upto' }]),
        createFormItem("Event Type", "eventType", <Select>
            <Select.Option value="online">Online</Select.Option>
            <Select.Option value="offline">Offline</Select.Option>
            <Select.Option value="not_event">Not Event</Select.Option>
            <Select.Option value="challenge">Challenge</Select.Option>
        </Select>, [{ required: true, message: 'Please select the event type' }]),
        createFormItem("Description", "description", <Input.TextArea />, [{ max: 125 }]),
        createFormItem("Category", "category", <Select>
            <Select.Option value="support_groups">Support Groups</Select.Option>
            <Select.Option value="active_together">Active Together</Select.Option>
            <Select.Option value="wellness_connect">Wellness Connect</Select.Option>
        </Select>, [{ required: true, message: 'Please select the category' }]),
        createFormItem("Max Visitors Allowed", "maxVisitorsAllowed", <InputNumber className='w-full' />, []),
        createFormItem("Prize Money", "prizeMoney", <InputNumber className='w-full' />, []),
        createFormItem("Guest Speaker", "guestSpeaker", <Input />, [{ required: true, message: 'Please select the guest speaker' }]),
        createFormItem("Meeting Link", "meetingLink", <Input />, []),
        createFormItem("Meeting ID", "meeting_id", <Input />, []),
        createFormItem("Meeting Passcode", "passcode", <Input />, []),
        createFormItem("Event Price", "eventPrice", <InputNumber className='w-full' />, []),
        createFormItem("Repeat", "repeat", <Select>
            <Select.Option value="once">Once</Select.Option>
            <Select.Option value="daily">Daily</Select.Option>
            <Select.Option value="weekly">Weekly</Select.Option>
            <Select.Option value="monthly">Monthly</Select.Option>
        </Select>, [{ required: true, message: 'Please select the repeat' }]),
        createFormItem("Registration Allowed Till", "registrationAllowedTill", <DatePicker className='w-full' format="YYYY-MM-DD HH:mm:ss" showTime />, []),
        createFormItem("Premium Users Only", "isPremiumUserOnly", <Select placeholder="Select an option">
            <Select.Option value={true}>Yes</Select.Option>
            <Select.Option value={false}>No</Select.Option>
        </Select>, [{ required: true, message: 'Please select an option' }]),
    ];

    const contributeEventItems = [
        createFormItem('Name', 'name', <Input />, [{ required: true, message: 'Please enter the name' }]),
        createFormItem("Slug", "slug", <Input disabled={editMode} />, [{ required: true, message: 'Please enter the slug' }]),
        createFormItem('Email', 'email', <Input type="email" />, [{ required: true, message: 'Please enter a valid email' }]),
        createFormItem('Company', 'company', <Input />, []),
        createFormItem('Website', 'website', <Input />, []),
        createFormItem('Stipend', 'stipend', <InputNumber className="w-full" />, []),
        createFormItem('Paid Opportunity', 'isPaid', <Select>
            <Select.Option value={true}>Yes</Select.Option>
            <Select.Option value={false}>No</Select.Option>
        </Select>, []),
        createFormItem('Phone Number', 'phoneNumber', <Input />, []),
        createFormItem('Description', 'description', <Input.TextArea />, []),
        createFormItem('Location Type', 'locationType', <Select>
            <Select.Option value="remote">Remote</Select.Option>
            <Select.Option value="onsite">Onsite</Select.Option>
        </Select>, []),
        createFormItem('Start Date', 'startDate', <DatePicker className="w-full" format="YYYY-MM-DD" />, []),
        createFormItem('Valid Upto', 'validUpto', <DatePicker className="w-full" format="YYYY-MM-DD" />, []),
        createFormItem('Highlights', 'highlights', (
            <Form.List name="highlights">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                            <div key={key} className="flex items-center gap-2">
                                <Form.Item
                                    {...restField}
                                    name={[name, 'icon']}
                                    fieldKey={[fieldKey, 'icon']}
                                    rules={[{ required: true, message: 'Missing icon' }]}
                                >
                                    <Input placeholder="Icon URL" />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'text']}
                                    fieldKey={[fieldKey, 'text']}
                                    rules={[{ required: true, message: 'Missing text' }]}
                                >
                                    <Input placeholder="Text" />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                            </div>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add Highlight
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        ), []),
    ];

    const imageFormItem = createFormItem('Image', 'image', <S3Uploader setFileUrl={setUploadedImageUrl} finalFileUrl={uploadedImageUrl} />, []);

    const submitFormItem = createFormItem('', 'submit', <Button type="primary" htmlType="submit">{data ? 'Update' : 'Create'}</Button>, []);

    const formItems = contribute ? contributeEventItems : standardEventItems;

    const RenderFormItem = ({ item }) => (
        <Form.Item key={item.name} label={item.label} name={item.name} rules={item.rules}>
            {item.component}
        </Form.Item>
    );

    return (
        <div className="min-h-screen flex py-5 overflow-auto w-full">
            <div className="w-full">
                {!data && (
                    <div className="flex justify-end mb-5">
                        <Button onClick={() => setVisible(false)} type="primary">
                            Close
                        </Button>
                    </div>
                )}
                <Form
                    onFinish={handleCreate}
                    layout="vertical"
                    form={form}
                    className="w-full grid md:grid-cols-4 gap-4 justify-center"
                >
                    {formItems.map((item) => RenderFormItem({ item }))}
                    {RenderFormItem({ item: imageFormItem })}
                    <Form.Item style={{ gridColumn: '4' }}>
                        <div className="flex justify-end items-end">
                            {RenderFormItem({ item: submitFormItem })}
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default CreateEventPopup;