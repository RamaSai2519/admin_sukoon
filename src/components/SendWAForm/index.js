import { Button, Form, Input } from 'antd';
import React from 'react';

const SendWAForm = () => {
    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        window.alert('Failed to send message');
    };

    return (
        <React.Fragment>
            <Form
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: 'Please input the phone number!', },]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Message" name="message" rules={[{ required: true, message: 'Please input the message!', },]}>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Send
                    </Button>
                </Form.Item>
            </Form>
        </React.Fragment>
    );
};

export default SendWAForm;