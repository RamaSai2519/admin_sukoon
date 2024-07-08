import React, { useEffect, useState } from 'react';
import { Table, Button, ConfigProvider, theme } from 'antd';
import Raxios from '../services/axiosHelper';
import { useParams } from 'react-router-dom';
import LazyLoad from '../components/LazyLoad/lazyload';
import { FaArrowLeft } from 'react-icons/fa';

const EventDetails = () => {
    const { slug } = useParams();
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [mainTitle, setMainTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const darkMode = localStorage.getItem('darkMode') === 'true';

    

    const fetchEventDetails = async () => {
        try {
            const response = await Raxios.get(`/event/event?slug=${slug}`);
            setName(response.data.name);
            setMainTitle(response.data.mainTitle);
            setSubTitle(response.data.subTitle);
            setImage(response.data.imageUrl);
        } catch (error) {
            console.error('Error fetching event details:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await Raxios.get(`/event/users?slug=${slug}`);
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching event users:', error);
            setUsers([]);
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await Raxios.put(`/event/event?slug=${slug}`, {
                name,
                mainTitle,
                subTitle,
                slug,
                imageUrl: image
            });
            setName(response.data.name);
            setMainTitle(response.data.mainTitle);
            setSubTitle(response.data.subTitle);
            setImage(response.data.imageUrl);
            window.alert('Event details updated successfully.');
        } catch (error) {
            console.error('Error updating event details:', error);
            window.alert('Error updating event details:', error);
        }
    };

    };

    useEffect(() => {
        fetchEventDetails();
        fetchUsers();
    }, [slug]);



    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Contact',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'City',
            dataIndex: 'city',
            key: 'city'
        },
        {
            title: "Created At",
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (time) => new Date(time).toLocaleString()
        },
        {
            title: "Updated At",
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (time) => new Date(time).toLocaleString()
        },
    ];

    return (
        <LazyLoad>
            <ConfigProvider theme={
                {
                    algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                }
            }>
                <div className="container flex flex-col p-5 min-h-screen">
                    <div id='details-header' className='flex flex-row items-center justify-between'>
                        <h1>Event Details</h1>
                        <button className='back-button' onClick={() => window.history.back()}>
                            <FaArrowLeft className="back-icon" />
                        </button>
                    </div>
                    <div className='flex w-full items-center justify-stretch '>
                        <div id='details-content' className='grid md:grid-cols-3 md:gap-4 items-center'>
                            <div className='grid-tile'>
                                <h3>Title</h3>
                                <input type="text" value={mainTitle} onChange={(e) => setMainTitle(e.target.value)} />
                            </div>
                            <div className='grid-tile'>
                                <h3>Subtitle</h3>
                                <input type="text" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} />
                            </div>
                            <div className='grid-tile'>
                                <h3>Name</h3>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <Button className='w-fit ' onClick={handleUpdate}>Update Details</Button>
                        </div>
                    </div>
                    <div className='w-full'>
                        <div className='flex justify-between'>
                            <h1>Registered Users</h1>
                            <Button onClick={downloadExcel}>Download Excel</Button>
                        </div>
                        <Table dataSource={users || []} columns={columns} rowKey={(record) => record._id || record.email} />
                    </div>
                </div>
            </ConfigProvider>
        </LazyLoad>
    );

export default EventDetails;
