import React from 'react';
import { Table, ConfigProvider, theme } from 'antd';
import { useEvents } from '../../services/useData';
import LazyLoad from '../../components/LazyLoad/lazyload';
import { Link } from 'react-router-dom';
import EventDetails from '../../EventDetails';

const EventsTab = () => {
    const { events, fetchEvents } = useEvents();
    const darkMode = localStorage.getItem('darkMode') === 'true';

    React.useEffect(() => {
        fetchEvents();
    }, []);

    const columns = [
        {
            title: 'Title',
            dataIndex: 'mainTitle',
            key: 'mainTitle',
        },
        {
            title: 'Subtitle',
            dataIndex: 'subTitle',
            key: 'subTitle'
        },
        {
            title: 'Author',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug'
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
        {
            title: 'Details',
            key: 'details',
            render: (text, record) => (
                <Link to={{ pathname: `/admin/events/${record.slug}`}} className="view-details-link">
                    View
                </Link>
            ),
        },
    ];

    return (
        <LazyLoad>
            <ConfigProvider theme={
                {
                    algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                }
            }>
                <div className="container min-h-screen">
                    <div className='w-full'>
                        <Table dataSource={events} columns={columns} />
                    </div>
                </div>
            </ConfigProvider>
        </LazyLoad>
    );
};

export default EventsTab;