import React, { useEffect, useState } from 'react';
import { Table, ConfigProvider, theme } from 'antd';
import Raxios from '../services/axiosHelper';
import { useParams } from 'react-router-dom';
import LazyLoad from '../components/LazyLoad/lazyload';

const EventDetails = () => {
    const { slug } = useParams();
    const [users, setUsers] = useState(null);
    const [event, setEvent] = useState(null);
    const darkMode = localStorage.getItem('darkMode') === 'true';

    useEffect(() => {
        Raxios.get(`/event/event?slug=${slug}`)
            .then(response => {
                setEvent(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching event details:', error);
            })
    }, [slug]);

    useEffect(() => {
        Raxios.get(`/event/users?slug=${slug}`)
            .then(response => {
                setUsers(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching event details:', error);
            })
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
                <div className="container p-5 min-h-screen">
                    <div className='flex gap-4'>
                        <h1>Title:</h1>
                        <h1>{event?.mainTitle}</h1>
                    </div>
                    <div className='flex gap-4'>
                        <h1>Description:</h1>
                        <h1>{event?.subTitle}</h1>
                    </div>
                    <div className='flex gap-4'>
                        <h1>Author:</h1>
                        <h1>{event?.name}</h1>
                    </div>
                    <div className='w-full'>
                        <h1>Registered Users</h1>
                        <Table dataSource={users} columns={columns} />
                    </div>
                </div>
            </ConfigProvider>
        </LazyLoad>
    );
};

export default EventDetails;