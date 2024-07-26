import React, { useState } from 'react';
import { Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import Raxios from '../services/axiosHelper';
import './AdminLogin.css';

const AdminLogin = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [newAdmin, setNewAdmin] = useState(false);

    const onFinish = async (values) => {
        const { id, password } = values;
        if (!id || !password) {
            alert('Please fill in all fields');
            return;
        }
        try {
            const response = await Raxios.post('/auth/login', {
                id,
                password,
            });
            if (response.status !== 200) {
                throw new Error('Login failed');
            }
            if (response.data.message === 'Authorized Admin') {
                setNewAdmin(true);
                return;
            }
            const { access_token, refresh_token, user } = response.data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            localStorage.setItem('adminName', user.name);
            setIsLoggedIn(true);
            localStorage.setItem('isLoggedIn', 'true');
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Login failed', error);
            alert('Login failed, Please recheck your credentials. If the problem persists, please contact your IT Administrator.');
        }
    };

    const onCreateAdmin = async (values) => {
        const { name, phone: phoneNumber, password } = values;
        if (!name || !phoneNumber || !password) {
            alert('Please fill in all fields');
            return;
        }
        if (password !== values.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        try {
            const response = await Raxios.post('/auth/register', {
                name,
                phoneNumber,
                password,
            });
            if (response.status !== 200) {
                throw new Error('Admin creation failed');
            }
            alert('Admin created successfully');
            setNewAdmin(false);
        } catch (error) {
            console.error('Admin creation failed', error);
            alert('Admin creation failed, Please recheck your credentials. If the problem persists, please contact your IT Administrator.');
        }
    };

    return (

        <div className='h-screen flex justify-center items-center'>
            <div className="dark:bg-lightBlack flex flex-col justify-center p-10 rounded-3xl">
                <h1 className='text-3xl m-5 mt-0'>Login to access dashboard</h1>
                {!newAdmin &&
                    <Form
                        className='h-full'
                        name="admin_login"
                        onFinish={onFinish}
                        initialValues={{ remember: true }}
                    >
                        <Form.Item
                            name="id"
                            rules={[{ required: true, message: 'Please input your ID!' }]}
                        >
                            <Input placeholder="Phone Number" />
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
                }
                {newAdmin &&
                    <Form
                        className='h-full'
                        name="admin_login"
                        onFinish={onCreateAdmin}
                        initialValues={{ remember: true }}
                    >
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <Input placeholder="Name" />
                        </Form.Item>
                        <Form.Item
                            name="phone"
                            label="Phone Number"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your phone number!',
                                },
                            ]}
                        >
                            <Input placeholder="Phone Number" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password placeholder="Password" />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password placeholder="Confirm Password" />
                        </Form.Item>
                        <Form.Item>
                            <button>Sign In</button>
                        </Form.Item>
                    </Form>
                }
            </div>
        </div>
    );
};

export default AdminLogin;