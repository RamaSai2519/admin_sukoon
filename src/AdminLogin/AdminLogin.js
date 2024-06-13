import React from 'react';
import { Form, Input, ConfigProvider, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import Raxios from '../services/axiosHelper';
import './AdminLogin.css';

const AdminLogin = ({ setIsLoggedIn }) => {
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const navigate = useNavigate();

    React.useEffect(() => {
        if (darkMode) {
            localStorage.setItem('darkMode', 'true');
            document.body.classList.add('dark');
        } else {
            localStorage.setItem('darkMode', 'false');
            document.body.classList.remove('dark');
        }
    }, [darkMode]);


    const onFinish = async (values) => {
        const { id, password } = values;
        try {
            const response = await Raxios.post('/auth/login', {
                id,
                password,
            });
            const { access_token, refresh_token } = response.data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            setIsLoggedIn(true);
            localStorage.setItem('isLoggedIn', 'true');
            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Login failed', error);
            alert('Login failed, Please recheck your credentials. If the problem persists, please contact your IT Admin.');
        }
    };

    return (
        <ConfigProvider theme={
            {
                algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }
        }>
            <div className='h-screen flex justify-center items-center'>
                <div className="dark:bg-lightBlack flex flex-col justify-center p-10 rounded-3xl">
                    <h1 className='text-3xl m-5 mt-0'>Login to access dashboard</h1>
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
                            <Input placeholder="ID" />
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
                </div>
            </div>
        </ConfigProvider>
    );
};

export default AdminLogin;