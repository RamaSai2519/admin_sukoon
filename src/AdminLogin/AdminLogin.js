import React, { useState } from 'react';
import { Form, Input, ConfigProvider, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import Raxios from '../services/axiosHelper';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const onFinish = async (values) => {
        const { email, password } = values;
        try {
            const response = await Raxios.post('/auth/login', {
                email,
                password,
            });
            const { access_token, refresh_token } = response.data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
        } catch (error) {
            console.error('Login failed', error);
            alert('Login failed');
        }
        onLogin();
        navigate('/admin/dashboard');
    };

    return (
        <div className='h-screen flex justify-center items-center'>
            <div className="dark:bg-lightBlack flex flex-col justify-center p-10 rounded-3xl">
                <h1 className='text-3xl m-5 mt-0'>Login to access dashboard</h1>
                <ConfigProvider theme={
                    {
                        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                    }
                }>
                    <Form
                        className='h-full'
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
                    </Form>
                </ConfigProvider>
            </div>
        </div>
    );
};

export default AdminLogin;