import React, { useEffect, useRef, useState } from 'react';
import { useFilters } from '../../services/useData';
import { Link, useLocation } from 'react-router-dom';
import { RaxiosPost } from '../../services/fetchData';
import Loading from '../../components/Loading/loading';
import EditableCell from '../../components/EditableCell';
import LazyLoad from '../../components/LazyLoad/lazyload';
import { Table, Button, Flex, Radio, message } from 'antd';
import { raxiosFetchData } from '../../services/fetchData';
import GetColumnSearchProps from '../../Utils/antTableHelper';
import { formatDate, formatTime } from '../../Utils/formatHelper';
import CreateEventPopup from '../../components/Popups/CreateEventPopup';

const EventsTab = () => {
    const location = useLocation();
    const { filters = {} } = useFilters();
    const filter = filters[location.pathname] || {};

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [eventUsers, setEventUsers] = useState([]);
    const [totalEventUsers, setTotalEventUsers] = useState(0);
    const [usersPage, setUsersPage] = useState(
        localStorage.getItem('usersPage') ? parseInt(localStorage.getItem('usersPage')) : 1
    );
    const [usersPageSize, setUsersPageSize] = useState(10);
    const [table, setTable] = useState(
        localStorage.getItem('eventsTable') === 'users' ? 'users' : 'events'
    );

    const [eventsPage, setEventsPage] = useState(
        localStorage.getItem('eventsPage') ? parseInt(localStorage.getItem('eventsPage')) : 1
    );
    const [eventsPageSize, setEventsPageSize] = useState(10);
    const [eventsTotal, setEventsTotal] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInputRef = useRef(null);

    const handleTableChange = (current, pageSize) => {
        setEventsPage(current);
        localStorage.setItem('eventsPage', current);
        setEventsPageSize(pageSize);
    };

    const fetchEvents = async () => {
        if (table === 'events') {
            raxiosFetchData(eventsPage, eventsPageSize, setEvents, setEventsTotal, '/list_events', filter, setLoading);
        } else {
            raxiosFetchData(usersPage, usersPageSize, setEventUsers, setTotalEventUsers, '/list_event_users', filter, setLoading);
        }
    };

    useEffect(() => {
        fetchEvents();

        // eslint-disable-next-line
    }, [eventsPage, eventsPageSize, usersPage, usersPageSize, table, JSON.stringify(filter)]);

    const createColumn = (title, dataIndex, key, render, width, editable, filter = true) => {
        return {
            title,
            dataIndex,
            key,
            ...GetColumnSearchProps(dataIndex, title, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef, location.pathname, filter),
            ...(render && { render }),
            ...(width && { width }),
            ...(editable && { editable }),
        };
    };

    const columns = [
        createColumn('Title', 'mainTitle', 'mainTitle'),
        createColumn('Subtitle', 'subTitle', 'subTitle'),
        createColumn('Hosted By', 'hostedBy', 'hostedBy'),
        createColumn('Date', 'validUpto', 'validUpto', (date) => date ? formatDate(date) : '', '125px', null, false),
        createColumn('Author', 'name', 'name'),
        createColumn('Slug', 'slug', 'slug'),
        createColumn('Created At', 'createdAt', 'createdAt', (time) => formatTime(time), '125px', null, false),
        createColumn('Updated At', 'updatedAt', 'updatedAt', (time) => formatTime(time), '125px', null, false),
        {
            title: 'Details', key: 'details',
            render: (_, record) => (
                <Link to={{ pathname: `/admin/events/${record.slug}` }} className="view-details-link">
                    <Button>View</Button>
                </Link>
            )
        },
    ];

    const userColumns = [
        createColumn('Name', 'name', 'name'),
        createColumn('Contact', 'phoneNumber', 'phoneNumber'),
        createColumn('Email', 'email', 'email'),
        createColumn('City', 'city', 'city'),
        createColumn('Source', 'source', 'source'),
        createColumn('Event Name', 'eventName', 'eventName'),
        createColumn('Remarks', 'remarks', 'remarks', null, '', true),
        createColumn('Created At', 'createdAt', 'createdAt', (time) => formatTime(time), '', null, false),
        createColumn('Updated At', 'updatedAt', 'updatedAt', (time) => formatTime(time), '', null, false),
    ];

    const handleSave = async ({ key, field, value }) => {
        const response = await RaxiosPost('/remarks', { key, value });
        if (response.status !== 200) {
            message.error(response.msg);
        } else {
            let newEventUsers = [...eventUsers];
            const index = newEventUsers.findIndex((item) => key === item._id);
            newEventUsers[index][field] = value;
            setEventUsers(newEventUsers);
            message.success(response.msg);
        }
    };

    const components = {
        body: {
            cell: EditableCell,
        },
    };

    const mergedColumns = userColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    if (loading) { return <Loading /> }

    return (
        <LazyLoad>
            <div className="min-h-screen overflow-auto">
                {!visible ?
                    <div className='flex justify-between my-2'>
                        <Flex className='gap-2 justify-center items-center '>
                            <Radio.Group
                                value={table}
                                onChange={(e) => {
                                    localStorage.setItem('eventsTable', e.target.value);
                                    setTable(e.target.value);
                                }}
                            >
                                <Radio.Button value="events">Events</Radio.Button>
                                <Radio.Button value="users">All Users</Radio.Button>
                            </Radio.Group>
                        </Flex>
                        <Button onClick={() => setVisible(true)} type="primary">
                            Create Event
                        </Button>
                    </div>
                    : null
                }
                <div className='w-full'>
                    {visible ?
                        <CreateEventPopup setVisible={setVisible} />
                        : table === 'events' ?
                            <Table
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
                            : <Table
                                dataSource={eventUsers}
                                columns={mergedColumns}
                                components={components}
                                rowKey={(record) => record._id}
                                pagination={
                                    {
                                        showSizeChanger: true,
                                        current: usersPage,
                                        pageSize: usersPageSize,
                                        total: totalEventUsers,
                                        onChange: (current, pageSize) => {
                                            setUsersPage(current);
                                            localStorage.setItem('usersPage', current);
                                            setUsersPageSize(pageSize);
                                        },
                                    }
                                }
                            />}
                </div>
            </div>
        </LazyLoad>
    );
};

export default EventsTab;