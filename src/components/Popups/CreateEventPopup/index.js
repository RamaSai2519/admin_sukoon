import React, { useState } from 'react';
import dayjs from 'dayjs';
import S3Uploader from '../../Upload';
import { RaxiosPost } from '../../../services/fetchData';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useAdmin, usePlatformCategories } from '../../../contexts/useData';
import { Form, Input, Button, message, Select, DatePicker, InputNumber } from 'antd';

const CreateEventPopup = ({ setVisible, data, editMode, contribute }) => {
    const { admin } = useAdmin();
    const [form] = Form.useForm();
    const [image, setImage] = useState(data?.image || data?.imageUrl || null);
    const { platformCategories } = usePlatformCategories();

    const initialData = (
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
                sub_category: data?.sub_category,
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
                sub_category: data?.sub_category,
                isPremiumUserOnly: data?.isPremiumUserOnly,
            }
    );

    const handleCreate = async (values) => {
        const endpoint = `/actions/${contribute ? 'upsert_contribute' : 'upsert_event'}`;
        const response = await RaxiosPost(endpoint, values);
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
        createFormItem("Description", "description", <Input.TextArea />, []),
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
    ];
    const highlightsFormItem = createFormItem('Highlights', 'highlights', (
        <Form.List name="highlights">
            {(fields, { add, remove }) => (
                <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                        <div key={key} className="flex items-center gap-2 mb-2">
                            <Form.Item
                                className='mb-0'
                                {...restField}
                                name={[name, 'icon']}
                                fieldKey={[fieldKey, 'icon']}
                                rules={[{ required: true, message: 'Missing icon URL' }]}
                            >
                                <Input placeholder="Icon URL" suffix={
                                    <S3Uploader show={false}
                                        setFileUrl={(url) => form.setFieldValue(['highlights', name, 'icon'], url)}
                                        finalFileUrl={form.getFieldValue(['highlights', name, 'icon'])}
                                    />
                                } />
                            </Form.Item>
                            <Form.Item
                                className='mb-0'
                                {...restField}
                                name={[name, 'text']}
                                fieldKey={[fieldKey, 'text']}
                                rules={[{ required: true, message: 'Missing text' }]}
                            >
                                <Input className='h-[43.5px]' placeholder="Text" />
                            </Form.Item>
                            <MinusCircleOutlined className='text-red-600' onClick={() => remove(name)} />
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
    ), []);

    const changeImage = (url) => {
        form.setFieldsValue({ [`${contribute ? 'image' : 'imageUrl'}`]: url });
        setImage(url);
    };

    const imageFormItem = createFormItem('Image', `${contribute ? 'image' : 'imageUrl'}`,
        <Form.Item>
            <S3Uploader
                show={true}
                setFileUrl={changeImage}
                finalFileUrl={image}
            />
        </Form.Item>
        , []
    );

    const submitFormItem = createFormItem('', 'submit', <Button type="primary" htmlType="submit">{data ? 'Update' : 'Create'}</Button>, []);

    const platformCategoriesItem = createFormItem('Platform Categories', 'sub_category',
        <Select
            mode={'multiple'}
            className="w-full mt-2"
            placeholder={`Select Platform`}
            disabled={!editMode}
        >
            {platformCategories.map((option) => (
                <Select.Option key={option._id} value={option._id} >{option.name}</Select.Option>
            ))}
        </Select>
    )

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
                    initialValues={initialData}
                    className="w-full"
                >
                    <div className='grid md:grid-cols-4 gap-4 justify-center'>
                        {formItems.map((item) => RenderFormItem({ item }))}
                    </div>
                    {RenderFormItem({ item: platformCategoriesItem })}
                    <div className='flex justify-between'>
                        {contribute && RenderFormItem({ item: highlightsFormItem })}
                        {RenderFormItem({ item: imageFormItem })}
                        {RenderFormItem({ item: submitFormItem })}
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default CreateEventPopup;