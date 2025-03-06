import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useFilters } from '../contexts/useData';
import { formatDate } from '../Utils/formatHelper';
import { RaxiosPost } from '../services/fetchData';
import Loading from '../components/Loading/loading';
import { Link, useLocation } from 'react-router-dom';
import EditableCell from '../components/EditableCell';
import LazyLoad from '../components/LazyLoad/lazyload';
import { raxiosFetchData } from '../services/fetchData';
import GetColumnSearchProps from '../Utils/antTableHelper';
import { Button, Table, Select, DatePicker, message } from 'antd';

const UserEngagement = ({ setExportFileUrl }) => {
    const location = useLocation();
    const { filters = {} } = useFilters();
    const filter = filters[location.pathname] || {};

    const [engagementData, setEngagementData] = useState([]);
    const [currentPage, setCurrentPage] = useState(
        localStorage.getItem('currentPage') ? parseInt(localStorage.getItem('currentPage')) : 1
    );
    const [pageSize, setPageSize] = useState(
        localStorage.getItem('pageSize') ? parseInt(localStorage.getItem('pageSize')) : 10
    );
    const [loading, setLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [userStatusOptions, setUserStatusOptions] = useState([]);
    const searchInputRef = useRef(null);

    const fetchData = async () => {
        const data = await raxiosFetchData(currentPage, pageSize, setEngagementData, setTotalItems, '/actions/user_engagement', filter, setLoading);
        setExportFileUrl(data.fileUrl);

        await raxiosFetchData(null, null, setUserStatusOptions, null, '/actions/user_status_options', null, setLoading);
    };

    // eslint-disable-next-line
    useEffect(() => { fetchData() }, [currentPage, pageSize, JSON.stringify(filter)]);

    const data = engagementData.map((item) => ({
        _id: item._id,
        type: item.type || '',
        name: item.name || '',
        city: item.city || '',
        slDays: item.slDays || 0,
        gender: item.gender || '',
        expert: item.expert || '',
        source: item.source || '',
        callAge: item.callAge || 0,
        remarks: item.remarks || '',
        eventAge: item.eventAge || 0,
        lastReached: item.lastReached,
        callsDone: item.callsDone || 0,
        birthDate: item.birthDate || '',
        refSource: item.refSource || '',
        eventsDone: item.eventsDone || 0,
        callStatus: item.callStatus || '',
        userStatus: item.userStatus || '',
        eventStatus: item.eventStatus || '',
        createdDate: item.createdDate || '',
        phoneNumber: item.phoneNumber || '',
        wa_opt_out: item.wa_opt_out || false,
        lastCallDate: item.lastCallDate || '',
        lastEventDate: item.lastEventDate || '',
    }));

    const createColumn = (title, dataIndex, key, width, fixed, editable, render, filter = false) => {
        return {
            title,
            dataIndex,
            key,
            ...fixed && { fixed },
            ...(width && { width }),
            ...(render && { render }),
            ...(editable && { editable }),
            ...GetColumnSearchProps(dataIndex, title, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef, location.pathname, filter),
        };
    };

    const columns = [
        createColumn('Type', 'type', 'type', 100),
        createColumn('Name', 'name', 'name', 150, 'left', true, null, true),
        createColumn('DOJ', 'createdDate', 'createdDate', 110, null, null, (record) => formatDate(record)),
        createColumn('SL Days', 'slDays', 'slDays', 90),
        createColumn('Call Status', 'callStatus', 'callStatus', 110),
        createColumn('User Status', 'userStatus', 'userStatus', 200, null, null, (text, record) => (
            <Select
                className='w-full'
                value={text}
                onChange={(value) => handleUserStatusChange(value, record)}
                options={userStatusOptions}
            />
        )),
        createColumn('Contact', 'phoneNumber', 'phoneNumber', 120, null, null, null, true),
        createColumn('City', 'city', 'city', 150, null, true, null, true),
        createColumn('DOB', 'birthDate', 'birthDate', 200, null, null, (text, record) => (
            <DatePicker
                value={text ? dayjs(text, 'YYYY-MM-DD') : null}
                onChange={(date) => handleLastReachedChange(date, record, 'birthDate')}
            />
        )),
        createColumn('Gender', 'gender', 'gender', 120, null, true, null, true),
        createColumn('Last Call Date', 'lastCallDate', 'lastCallDate', 135, null, null, (record) => formatDate(record)),
        createColumn('Call Age', 'callAge', 'callAge', 90),
        createColumn('Calls', 'callsDone', 'callsDone', 70),
        createColumn('Last Event Date', 'lastEventDate', 'lastEventDate', 135, null, null, (record) => formatDate(record)),
        createColumn('Event Age', 'eventAge', 'eventAge', 90),
        createColumn('Events', 'eventsDone', 'eventsDone', 70),
        createColumn('Last Reached', 'lastReached', 'lastReached', 200, null, null, (text, record) => (
            <DatePicker
                value={text ? dayjs(text, 'YYYY-MM-DD') : null}
                onChange={(date) => handleLastReachedChange(date, record)}
            />
        )),
        createColumn('Remarks', 'remarks', 'remarks', 250, null, true),
        createColumn('Source', 'source', 'source', 150, null, true),
        createColumn('Ref Source', 'refSource', 'refSource', 150, null, true, null, true),
        createColumn('Sarathi', 'expert', 'expert', 150, null, true),
        {
            title: 'Actions',
            key: 'actions',
            width: 200,
            fixed: 'right',
            render: (record) => {
                console.log('record:', record);
                return (
                    <div className='flex justify-between w-full'>
                        <Button
                            danger={record.wa_opt_out}
                            onClick={() => handleSave({ key: record._id, field: 'wa_opt_out', value: !record.wa_opt_out })}
                        >
                            {record.wa_opt_out ? 'Opt In' : 'Opt Out'}
                        </Button>
                        <Link to={`/admin/users/${record._id}`}>
                            <Button onClick={() => localStorage.setItem('userNumber', record.phoneNumber)}>
                                View
                            </Button>
                        </Link>
                    </div>
                )
            },
        },
    ];

    const handleTableChange = (current, pageSize) => {
        setCurrentPage(current);
        localStorage.setItem('currentPage', current);
        setPageSize(pageSize);
        localStorage.setItem('pageSize', pageSize);
    };

    const handleSave = async ({ key, field, value }) => {
        const response = await RaxiosPost('/actions/user_engagement', { key, field, value });
        if (response.status !== 200) {
            message.error(response.msg);
        } else {
            const newData = [...engagementData];
            const index = newData.findIndex((item) => item._id === key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, [field]: value });
                setEngagementData(newData);
            }
        };
    };

    const handleUserStatusChange = async (value, record) => {
        await handleSave({ key: record._id, field: 'userStatus', value });
    };

    const handleLastReachedChange = async (date, record, field = 'lastReached') => {
        const value = date ? date.toISOString() : null;
        await handleSave({ key: record._id, field, value });
    };

    const components = {
        body: {
            cell: EditableCell,
        },
    };

    const mergedColumns = columns.map((col) => {
        if (!col.editable) return col;

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

    return (
        <div>
            {loading ? <Loading /> :
                <LazyLoad>
                    <div className='flex py-5 overflow-auto w-full'>
                        <Table
                            components={components}
                            dataSource={data}
                            columns={mergedColumns}
                            rowKey={(record) => record._id}
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                total: totalItems,
                                onChange: handleTableChange
                            }}
                            scroll={{
                                x: 'calc(100vw + 100px)'
                            }}
                        />
                    </div>
                </LazyLoad>
            }
        </div>
    );
};

export default UserEngagement;
