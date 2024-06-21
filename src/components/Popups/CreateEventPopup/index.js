import React, { useEffect } from 'react';
import { Form, Input, Button, message, Select, DatePicker, Upload } from 'antd';
import { useExperts } from '../../../services/useData';
import Raxios from '../../../services/axiosHelper';
import { PlusOutlined } from '@ant-design/icons';

const CreateEventPopup = ({ visible, setVisible }) => {
    const [form] = Form.useForm();
    const [uploadedImageUrl, setUploadedImageUrl] = React.useState('');
    const [ready, setReady] = React.useState(false);
    const { experts, fetchExperts } = useExperts();

    useEffect(() => {
        if (visible) {
            form.resetFields();
            fetchExperts();
        }
        // eslint-disable-next-line
    }, [visible, form]);

    const handleCreate = (values) => {
        if (values.slug.length >= 4) {
            message.error('Slug should be less than 4 characters');
            return;
        }

        Raxios.post('/event/event', {
            name: values.name,
            mainTitle: values.mainTitle,
            subTitle: values.subTitle,
            slug: values.slug,
            expert: values.expert,
            zoomLink: values.zoomLink,
            date: values.date,
            duration: values.duration,
            imageUrl: uploadedImageUrl  // Include the uploaded image URL
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
            label: "Created by",
            name: "name",
            rules: [{ required: true, message: 'Please enter the event name' }],
            component: <Input />
        },
        {
            label: "Main Title",
            name: "mainTitle",
            rules: [{ required: true, message: 'Please enter the main title' }],
            component: <Input />
        },
        {
            label: "Description",
            name: "subTitle",
            rules: [{ required: true, message: 'Please enter the description' }],
            component: <Input />
        },
        {
            label: "Slug",
            name: "slug",
            rules: [
                { required: true, message: 'Please enter the slug' },
                { max: 3, message: 'Slug should be less than 4 characters' }
            ],
            component: <Input />
        },
        {
            label: "Expert",
            name: "expert",
            rules: [{ required: true, message: 'Please select the expert' }],
            component: (
                <Select placeholder="Select expert">
                    {experts.map(expert => (
                        <Select.Option key={expert._id} value={expert._id}>
                            {expert.name}
                        </Select.Option>
                    ))}
                </Select>
            )
        },
        {
            label: "Zoom Link",
            name: "zoomLink",
            rules: [{ required: true, message: 'Please enter the zoom link' }],
            component: <Input />
        },
        {
            label: "Date",
            name: "date",
            rules: [{ required: true, message: 'Please enter the date' }],
            component: (
                <DatePicker
                    id="datetime"
                    style={{ width: "100%" }}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                />
            )
        },
        {
            label: "Duration",
            name: "duration",
            rules: [{ required: true, message: 'Please enter the duration' }],
            component: (
                <Select placeholder="Select duration">
                    {["30", "60", "90", "120", "150", "180"].map(duration => (
                        <Select.Option key={duration} value={duration}>
                            {duration} minutes
                        </Select.Option>
                    ))}
                </Select>
            )
        },
        {
            label: "Image",
            name: "image",
            rules: [{ required: true, message: 'Please upload the image' }],
            component: (
                <Upload
                    name="file"
                    listType="picture-card"
                    className="avatar-uploader"
                    action="https://apiadmin.sukoon.love/admin/service/upload"
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
                    form={form}
                    onFinish={handleCreate}
                    layout="vertical"
                    className='w-full grid grid-cols-2 gap-4'
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
                    <Form.Item>
                        <div className='flex justify-end'>
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
