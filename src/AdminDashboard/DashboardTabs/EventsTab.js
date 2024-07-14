import React, { useEffect, useState } from 'react';
import { Table, Button, ConfigProvider, theme } from 'antd';
import LazyLoad from '../../components/LazyLoad/lazyload';
import CreateEventPopup from '../../components/Popups/CreateEventPopup';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading/loading';
import { fetchPagedData } from '../../services/fetchData';

const EventsTab = () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState([]);

    const [eventsPage, setEventsPage] = useState(
        localStorage.getItem('eventsPage') ? parseInt(localStorage.getItem('eventsPage')) : 1
    );
    const [eventsPageSize, setEventsPageSize] = useState(8);
    const [eventsTotal, setEventsTotal] = useState(0);

    const handleTableChange = (current, pageSize) => {
        setEventsPage(current);
        localStorage.setItem('eventsPage', current);
        setEventsPageSize(pageSize);
    };

    useEffect(() => {
        fetchPagedData(eventsPage, eventsPageSize, setEvents, setEventsTotal, setLoading, '/event/events');
    }, [eventsPage, eventsPageSize]);

    const columns = [
        { title: 'Title', dataIndex: 'mainTitle', key: 'mainTitle', },
        { title: 'Subtitle', dataIndex: 'subTitle', key: 'subTitle' },
        { title: 'Expert', dataIndex: 'expert', key: 'expert' },
        { title: 'Hosted By', dataIndex: 'hostedBy', key: 'hostedBy' },
        {
            title: 'Date', dataIndex: 'validUpto', key: 'validUpto',
            render: (date) => date ? new Date(date).toLocaleDateString() : ''
        },
        { title: 'Author', dataIndex: 'name', key: 'name' },
        { title: 'Slug', dataIndex: 'slug', key: 'slug' },
        {
            title: "Created At", dataIndex: 'createdAt', key: 'createdAt',
            render: (time) => new Date(time).toLocaleString()
        },
        {
            title: "Updated At", dataIndex: 'updatedAt', key: 'updatedAt',
            render: (time) => new Date(time).toLocaleString()
        },
        {
            title: 'Details', key: 'details',
            render: (_, record) => (
                <Link to={{ pathname: `/admin/events/${record.slug}` }} className="view-details-link">
                    View
                </Link>
            ),
        },
    ];

    if (loading) { return <Loading />; }

    return (
        <LazyLoad>
            <ConfigProvider theme={
                {
                    algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                }
            }>
                <div className="min-h-screen">
                    {!visible ?
                        <div className='flex justify-end mb-5'>
                            <Button onClick={() => setVisible(true)} type="primary">
                                Create Event
                            </Button>
                        </div>
                        : null
                    }
                    <div className='w-full'>
                        {visible ?
                            <CreateEventPopup setVisible={setVisible} />
                            : <Table
                                dataSource={events}
                                columns={columns}
                                rowKey={(record) => record.slug}
                                pagination={
                                    {
                                        showSizeChanger: true,
                                        current: eventsPage,
                                        pageSize: eventsPageSize,
                                        total: eventsTotal,
                                        onChange: handleTableChange,
                                    }
                                }
                            />
                        }
                    </div>
                </div>
            </ConfigProvider>
        </LazyLoad>
    );
};

export default EventsTab;