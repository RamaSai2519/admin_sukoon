import { Link } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import Loading from '../../components/Loading/loading';
import { fetchPagedData } from '../../services/fetchData';
import LazyLoad from '../../components/LazyLoad/lazyload';
import { Table, Button, ConfigProvider, theme, Flex, Radio, Checkbox } from 'antd';
import { formatDate, formatTime } from '../../Utils/formatHelper';
import CreateEventPopup from '../../components/Popups/CreateEventPopup';
import getColumnSearchProps from '../../Utils/antTableHelper';
import Raxios from '../../services/axiosHelper';
import EditableCell from '../../components/EditableCell';

const EventsTab = () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [eventUsers, setEventUsers] = useState([]);
    const [filterOn, setFilterOn] = useState(false);
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

    useEffect(() => {
        if (table === 'events') {
            fetchPagedData(eventsPage, eventsPageSize, setEvents, setEventsTotal, setLoading, '/event/data');
        } else {
            fetchPagedData(usersPage, usersPageSize, setEventUsers, setTotalEventUsers, setLoading, '/event/allUsers', { filter: filterOn });
        }
    }, [eventsPage, eventsPageSize, usersPage, usersPageSize, table, filterOn]);

    const createColumn = (title, dataIndex, key, render, width, editable) => {
        return {
            title,
            dataIndex,
            key,
            ...getColumnSearchProps(dataIndex, title, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef),
            ...(render && { render }),
            ...(width && { width }),
            ...(editable && { editable }),
        };
    };

    const columns = [
        createColumn('Title', 'mainTitle', 'mainTitle'),
        createColumn('Subtitle', 'subTitle', 'subTitle'),
        createColumn('Expert', 'expert', 'expert'),
        createColumn('Hosted By', 'hostedBy', 'hostedBy'),
        createColumn('Date', 'validUpto', 'validUpto', (date) => date ? formatDate(date) : '', '125px'),
        createColumn('Author', 'name', 'name'),
        createColumn('Slug', 'slug', 'slug'),
        createColumn('Created At', 'createdAt', 'createdAt', (time) => formatTime(time), '125px'),
        createColumn('Updated At', 'updatedAt', 'updatedAt', (time) => formatTime(time), '125px'),
        {
            title: 'Details', key: 'details',
            render: (_, record) => (
                <Link to={{ pathname: `/admin/events/${record.slug}` }} className="view-details-link">
                    View
                </Link>
            )
        },
    ];

    const userColumns = [
        createColumn('Name', 'name', 'name'),
        createColumn('Contact', 'phoneNumber', 'phoneNumber'),
        createColumn('Email', 'email', 'email'),
        createColumn('City', 'city', 'city'),
        createColumn('Remarks', 'remarks', 'remarks', null, '', true),
        createColumn('Created At', 'createdAt', 'createdAt', (time) => formatTime(time)),
        createColumn('Updated At', 'updatedAt', 'updatedAt', (time) => formatTime(time))
    ];

    const handleSave = async ({ key, field, value }) => {
        try {
            await Raxios.post('/user/leadRemarks', { key, field, value })
                .then((response) => {
                    if (response.request.status === 200) {
                        let newEventUsers = [...eventUsers];
                        const index = newEventUsers.findIndex((item) => key === item._id);
                        newEventUsers[index][field] = value;
                        setEventUsers(newEventUsers);
                        window.alert(response.data.message);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.error('Error updating data:', error);
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
            <ConfigProvider theme={
                {
                    algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                }
            }>
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
                                    <Radio.Button value="events">EvenTots</Radio.Button>
                                    <Radio.Button value="users">All Users</Radio.Button>
                                </Radio.Group>
                                {table === 'users' &&
                                    <div>
                                        <Checkbox
                                            checked={filterOn}
                                            onChange={(e) => {
                                                setFilterOn(e.target.checked);
                                            }}
                                        >Filter Out Complete Signups</Checkbox>
                                    </div>
                                }
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
            </ConfigProvider>
        </LazyLoad>
    );
};

export default EventsTab;