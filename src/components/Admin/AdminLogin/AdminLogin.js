import React, { useState } from 'react';
import { Form, Input, ConfigProvider, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const onFinish = (values) => {
        const { email, password } = values;
        if (email === 'admin@sukoon.love' && password === 'Care@sukoon123') {
            onLogin();
            navigate('/admin/dashboard');
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div className='login-page'>
            <div className="admin-login-container">
                <h1>Hello Admin</h1>
                <ConfigProvider theme={
                    {
                        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                    }
                }>
                    <Form
                        name="admin_login"
                        onFinish={onFinish}
                        initialValues={{ remember: true }}

                    >
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input type="email" placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password placeholder="Password" />
                        </Form.Item>

                        <Form.Item>
                            <button>Sign In</button>
                        </Form.Item>

                        {error && <p>{error}</p>}
                    </Form>
                </ConfigProvider>
            </div>
        </div>
    );
};

export default AdminLogin;