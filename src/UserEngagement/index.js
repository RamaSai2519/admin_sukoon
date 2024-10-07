import React from 'react';
import { Button, Table, Select, DatePicker, message } from 'antd';
import { raxiosFetchData } from '../services/fetchData';
import LazyLoad from '../components/LazyLoad/lazyload';
import EditableCell from '../components/EditableCell';
import Loading from '../components/Loading/loading';
import { formatDate } from '../Utils/formatHelper';
import { RaxiosPost } from '../services/fetchData';
import { Link } from 'react-router-dom';
import moment from 'moment/moment';

const UserEngagement = ({ setExportFileUrl }) => {
    const [engagementData, setEngagementData] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(
        localStorage.getItem('currentPage') ? parseInt(localStorage.getItem('currentPage')) : 1
    );
    const [pageSize, setPageSize] = React.useState(10);
    const [loading, setLoading] = React.useState(false);
    const [totalItems, setTotalItems] = React.useState(0);

    const fetchData = async () => {
        const data = await raxiosFetchData(currentPage, pageSize, setEngagementData, setTotalItems, '/user_engagement', null, setLoading);
        setExportFileUrl(data.fileUrl);
    };

    React.useEffect(() => {
        fetchData();
    }, [currentPage, pageSize]);

    const data = engagementData.map((item) => ({
        _id: item._id,
        type: item.type || '',
        name: item.name || '',
        createdDate: item.createdDate || '',
        slDays: item.slDays || 0,
        callStatus: item.callStatus || '',
        userStatus: item.userStatus || '',
        phoneNumber: item.phoneNumber || '',
        city: item.city || '',
        dateOfBirth: item.birthDate || '',
        gender: item.gender || '',
        expert: item.expert || '',
        lastCallDate: item.lastCallDate || '',
        callAge: item.callAge || 0,
        callsDone: item.callsDone || 0,
        remarks: item.remarks || '',
        source: item.source || '',
        wa_opt_out: item.wa_opt_out || false,
        lastReached: item.lastReached,
        refSource: item.refSource || '',
    }));

    const userStatusOptions = [
        { value: 'Engaged User', label: 'Engaged User' },
        { value: 'Family & Friends', label: 'Family & Friends' },
        { value: 'Invalid/ Test user', label: 'Invalid/ Test user' },
        { value: 'Not reachable user', label: 'Not reachable user' },
        { value: 'Not interested user', label: 'Not interested user' },
        { value: 'Not interested in Calls', label: 'Not interested in Calls' },
    ];

    const generateFilters = (data, key) => {
        return data.reduce((acc, curr) => {
            if (curr[key] && !acc.find((item) => item.text === curr[key])) {
                acc.push({ text: curr[key], value: curr[key] });
            }
            return acc;
        }, []).map((item) => ({ text: item.text, value: item.value }));
    };


    const columns = [
        {
            title: "Type", dataIndex: "type", key: "type", width: 100,
            filters: generateFilters(data, 'type'),
            onFilter: (value, record) => record.type.includes(value)
        },
        {
            title: "Name", dataIndex: "name", key: "name", width: 150, fixed: 'left',
            filters: generateFilters(data, 'name'),
            filterSearch: true,
            onFilter: (value, record) => record.name.includes(value)
        },
        {
            title: "DOJ", dataIndex: "createdDate", key: "createdDate", width: 110,
            filters: generateFilters(data, 'createdDate'),
            onFilter: (value, record) => record.createdDate.includes(value),
            render: (record) => formatDate(record)
        },
        {
            title: "SL Days", dataIndex: "slDays", key: "slDays", width: 90,
            filters: generateFilters(data, 'slDays'),
            onFilter: (value, record) => record.slDays === value
        },
        {
            title: "Call Status", dataIndex: "callStatus", key: "callStatus", width: 110,
            filters: generateFilters(data, 'callStatus'),
            onFilter: (value, record) => record.callStatus.includes(value)
        },
        {
            title: "User Status", dataIndex: "userStatus", key: "userStatus", width: 200,
            render: (text, record) => (
                <Select
                    className='w-full'
                    value={text}
                    onChange={(value) => handleUserStatusChange(value, record)}
                    options={userStatusOptions}
                />
            ),
            filters: generateFilters(data, 'userStatus'),
            onFilter: (value, record) => record.userStatus.includes(value)
        },
        {
            title: "Contact", dataIndex: "phoneNumber", key: "phoneNumber", width: 120,
            filters: generateFilters(data, 'phoneNumber'),
            onFilter: (value, record) => record.phoneNumber.includes(value),
            filterSearch: true
        },
        {
            title: "City", dataIndex: "city", key: "city", width: 110,
            filters: generateFilters(data, 'city'),
            onFilter: (value, record) => record.city.includes(value)
        },
        {
            title: "DOB", dataIndex: "dateOfBirth", key: "dateOfBirth", width: 110,
            filters: generateFilters(data, 'dateOfBirth'),
            onFilter: (value, record) => record.dateOfBirth.includes(value),
            render: (record) => formatDate(record)
        },
        {
            title: "Gender", dataIndex: "gender", key: "gender", width: 90, editable: true,
            filters: generateFilters(data, 'gender'),
            onFilter: (value, record) => record.gender.includes(value)
        },
        {
            title: "Last Call Date", dataIndex: "lastCallDate", key: "lastCallDate", width: 135,
            filters: generateFilters(data, 'lastCallDate'),
            onFilter: (value, record) => record.lastCallDate.includes(value),
            render: (record) => formatDate(record)
        },
        {
            title: "Call Age", dataIndex: "callAge", key: "callAge", width: 90,
            filters: generateFilters(data, 'callAge'),
            onFilter: (value, record) => record.callAge === value
        },
        {
            title: "Calls", dataIndex: "callsDone", key: "callsDone", width: 70,
            filters: generateFilters(data, 'callsDone'),
            onFilter: (value, record) => record.callsDone === value
        },
        {
            title: "Last Reached",
            dataIndex: "lastReached",
            key: "lastReached",
            width: 200,
            filters: generateFilters(data, 'lastReached'),
            onFilter: (value, record) => record.lastReached.includes(value),
            render: (text, record) => (
                <DatePicker
                    value={text ? moment(text) : null}
                    onChange={(date) => handleLastReachedChange(date, record)}
                />
            )
        },
        {
            title: "Remarks", dataIndex: "remarks", key: "remarks", width: 250, editable: true,
            filters: generateFilters(data, 'remarks'),
            onFilter: (value, record) => record.remarks.includes(value)
        },
        {
            title: "Source", dataIndex: "source", key: "source", width: 150, editable: true,
            filters: generateFilters(data, 'source'),
            onFilter: (value, record) => record.source.includes(value)
        },
        {
            title: "Ref Source", dataIndex: "refSource", key: "refSource", width: 150, editable: true,
            filters: generateFilters(data, 'refSource'),
            onFilter: (value, record) => record.refSource.includes(value)
        },
        {
            title: "Sarathi", dataIndex: "expert", key: "saarthi", width: 150, editable: true,
            filters: generateFilters(data, 'expert'),
            onFilter: (value, record) => record.expert.includes(value)
        },
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
    };

    const handleSave = async ({ key, field, value }) => {
        const response = await RaxiosPost('/user_engagement', { key, field, value });
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

    const handleLastReachedChange = async (date, record) => {
        const value = date ? date.toISOString() : null;
        await handleSave({ key: record._id, field: 'lastReached', value });
    };

    const components = {
        body: {
            cell: EditableCell,
        },
    };

    const mergedColumns = columns.map((col) => {
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
