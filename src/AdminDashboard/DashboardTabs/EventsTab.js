import React, { useEffect } from 'react';
import { Table, Button, ConfigProvider, theme } from 'antd';
import { useEvents } from '../../services/useData';
import LazyLoad from '../../components/LazyLoad/lazyload';
import CreateEventPopup from '../../components/Popups/CreateEventPopup';
import { Link } from 'react-router-dom';

const EventsTab = () => {
    const { events, fetchEvents } = useEvents();
    const [visible, setVisible] = React.useState(false);
    const darkMode = localStorage.getItem('darkMode') === 'true';

    useEffect(() => {
        fetchEvents();
        // eslint-disable-next-line
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
            title: 'Expert',
            dataIndex: 'expert',
            key: 'expert'
        },
        {
            title: 'Hosted By',
            dataIndex: 'hostedBy',
            key: 'hostedBy'
        },
        {
            title: 'Date',
            dataIndex: 'validUpto',
            key: 'validUpto',
            render: (date) => date ? new Date(date).toLocaleDateString() : ''
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
                <Link to={{ pathname: `/admin/events/${record.slug}` }} className="view-details-link">
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
                                        pageSize: 8,
                                        showSizeChanger: true
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