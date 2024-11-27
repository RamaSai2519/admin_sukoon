import React, { useEffect, useState } from 'react';
import { Form, Select, DatePicker, Input, Button, message } from 'antd';
import { raxiosFetchData, RaxiosPost } from '../../services/fetchData';

const PostCallForm = ({ setShowForm }) => {
    const [loading, setLoading] = useState(false);
    const [userStatusOptions, setUserStatusOptions] = useState([]);
    const formData = JSON.parse(localStorage.getItem('formData'));

    // if (!formData) {
    //     message.error('No call data found');
    //     setShowForm(false);
    // }

    useEffect(() => {
        const fetchUserStatusOptions = async () => {
            setLoading(true);
            await raxiosFetchData(null, null, setUserStatusOptions, null, '/actions/user_status_options', null, setLoading);
            setLoading(false);
        };
        fetchUserStatusOptions();
    }, []);

    const handleSave = async ({ key, field, value }) => {
        const response = await RaxiosPost('/actions/user_engagemet', { key, field, value });
        if (response.status !== 200) message.error(response.msg);
    };

    const onFinish = (values) => {
        console.log("🚀 ~ onFinish ~ values:", values);
        Object.keys(values).forEach(field => {
            handleSave({ key: formData?.user_id || "Hello", field, value: values[field] });
        });
        setShowForm(false);
    };

    const formFields = [
        { name: "lastReached", label: "Last Reached Date", type: "datetime", placeholder: "Select date and time" },
        { name: "callLater", label: "Set Reminder to Call Later", type: "datetime", placeholder: "Select date and time" },
        { name: "remarks", label: "Remarks", type: "textarea", placeholder: "Enter text" },
        { name: "userStatus", label: "User Status", type: "select", placeholder: "Select user status", options: userStatusOptions },
    ];

    return (
        <div className="w-4/5 max-w-4xl mx-auto">
            <Form onFinish={onFinish} layout="vertical">
                <div className="flex gap-4">
                    {formFields.slice(0, 2).map((field, index) => (
                        <Form.Item
                            key={index}
                            name={field.name}
                            label={field.label}
                            rules={field.rules}
                        >
                            {field.type === "select" ? (
                                <Select placeholder={field.placeholder} loading={loading} options={field.options} allowClear />
                            ) : field.type === "datetime" ? (
                                <DatePicker showTime format="YYYY-MM-DD HH:mm" />
                            ) : null}
                        </Form.Item>
                    ))}
                </div>
                {formFields.slice(2).map((field, index) => (
                    <Form.Item
                        key={index}
                        name={field.name}
                        label={field.label}
                        rules={field.rules}
                    >
                        {field.type === "select" ? (
                            <Select placeholder={field.placeholder} loading={loading} options={userStatusOptions} allowClear />
                        ) : field.type === "datetime" ? (
                            <DatePicker showTime format="YYYY-MM-DD HH:mm" />
                        ) : field.type === "textarea" ? (
                            <Input.TextArea rows={4} placeholder={field.placeholder} />
                        ) : null}
                    </Form.Item>
                ))}
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default PostCallForm;
