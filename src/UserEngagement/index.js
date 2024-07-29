import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Table, Select } from 'antd';
import LazyLoad from '../components/LazyLoad/lazyload';
import Raxios from '../services/axiosHelper';
import Loading from '../components/Loading/loading';
import EditableCell from '../components/EditableCell';
import { fetchPagedData } from '../services/fetchData';
import { formatDate } from '../Utils/formatHelper';

const UserEngagement = () => {
    const [engagementData, setEngagementData] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(
        localStorage.getItem('currentPage') ? parseInt(localStorage.getItem('currentPage')) : 1
    );
    const [pageSize, setPageSize] = React.useState(10);
    const [totalItems, setTotalItems] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        fetchPagedData(currentPage, pageSize, setEngagementData, setTotalItems, setLoading, '/user/engagementData');
    }, [currentPage, pageSize]);

    const data = engagementData.map((item) => ({
        _id: item._id,
        poc: item.poc || 'N/A',
        name: item.name || 'N/A',
        createdDate: item.createdDate || 'N/A',
        slDays: item.slDays || 0,
        callStatus: item.callStatus || 'N/A',
        userStatus: item.userStatus || 'N/A',
        phoneNumber: item.phoneNumber || 'N/A',
        city: item.city || 'N/A',
        dateOfBirth: item.birthDate || 'N/A',
        gender: item.gender || 'N/A',
        expert: item.expert || 'N/A',
        lastCallDate: item.lastCallDate || 'N/A',
        callAge: item.callAge || 0,
        callsDone: item.callsDone || 0,
        remarks: item.remarks || 'N/A',
    }));

    const userStatusOptions = [
        { value: 'Not interested user', label: 'Not interested user' },
        { value: 'Family & Friends', label: 'Family & Friends' },
        { value: 'Invalid/ Test user', label: 'Invalid/ Test user' },
        { value: 'Engaged User', label: 'Engaged User' },
        { value: 'Not reachable user', label: 'Not reachable user' },
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
            title: "POC", dataIndex: "poc", key: "poc", width: 100, editable: true,
            filters: generateFilters(data, 'poc'),
            onFilter: (value, record) => record.poc.includes(value)
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
            title: "Saarthi", dataIndex: "expert", key: "saarthi", width: 150, editable: true,
            filters: generateFilters(data, 'expert'),
            onFilter: (value, record) => record.expert.includes(value)
        },
        {
            title: "Remarks", dataIndex: "remarks", key: "remarks", width: 250, editable: true,
            filters: generateFilters(data, 'remarks'),
            onFilter: (value, record) => record.remarks.includes(value)
        },
        {
            title: 'Details',
            key: 'details',
            width: 100,
            fixed: 'right',
            render: (record) => (
                <Link to={`/admin/users/${record._id}`}>
                    <Button>View</Button>
                </Link>
            ),
        },
    ];

    const handleTableChange = (current, pageSize) => {
        setCurrentPage(current);
        localStorage.setItem('currentPage', current);
        setPageSize(pageSize);
    };

    const handleSave = async ({ key, field, value }) => {
        try {
            await Raxios.post('/user/engagementData', { key, field, value });
            const newData = [...engagementData];
            const index = newData.findIndex((item) => item._id === key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, [field]: value });
                setEngagementData(newData);
            }
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const handleUserStatusChange = async (value, record) => {
        try {
            await Raxios.post('/user/engagementData', { key: record._id, field: 'userStatus', value });
            const newData = [...engagementData];
            const index = newData.findIndex((item) => item._id === record._id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, userStatus: value });
                setEngagementData(newData);
            }
        } catch (error) {
            console.error('Error updating user status:', error);
        }
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
