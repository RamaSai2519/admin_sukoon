import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Tooltip, ConfigProvider, theme } from 'antd';
import { FaArrowLeft } from 'react-icons/fa';
import LazyLoad from '../components/LazyLoad/lazyload';
import Raxios from '../services/axiosHelper';
import Loading from '../components/Loading/loading';
import EditableCell from '../components/EditableCell';

const UserEngagement = () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const [engagementData, setEngagementData] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [totalItems, setTotalItems] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    const fetchEngagementData = async (page, size) => {
        try {
            setLoading(true);
            const response = await Raxios.get('/user/engagementData', {
                params: { page, size }
            });
            setEngagementData(response.data.data);
            setTotalItems(response.data.total);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching engagement data:', error);
            setLoading(false);
            window.alert('Error fetching engagement data');
        }
    };

    React.useEffect(() => {
        fetchEngagementData(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const data = engagementData.map((item) => ({
        key: item._id,
        poc: item.poc,
        name: item.name,
        createdDate: item.createdDate,
        status: item.status,
        phoneNumber: item.phoneNumber,
        city: item.city,
        dateOfBirth: item.birthDate,
        gender: item.gender,
        lastCallDate: item.lastCallDate,
        callsDone: item.callsDone,
        remarks: item.remarks,
    }));

    const columns = [
        { title: "POC", dataIndex: "poc", key: "poc" },
        {
            title: "Name", dataIndex: "name", key: "name", editable: true, width: 150,
            ellipsis: {
                showTitle: false,
            },
            render: (address) => (
                <Tooltip placement="topLeft" title={address}>
                    {address}
                </Tooltip>
            ),
        },
        { title: "DOJ / Days in SL", dataIndex: "createdDate", key: "createdDate" },
        { title: "Status", dataIndex: "status", key: "status" },
        { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber", editable: true },
        { title: "City", dataIndex: "city", key: "city" },
        { title: "DOB / Age", dataIndex: "dateOfBirth", key: "dateOfBirth" },
        { title: "Gender", dataIndex: "gender", key: "gender" },
        { title: "Last Call Date / Call Age", dataIndex: "lastCallDate", key: "lastCallDate" },
        { title: "# Calls", dataIndex: "callsDone", key: "callsDone" },
        {
            title: "Remarks", dataIndex: "remarks", key: "remarks", editable: true, ellipsis: {
                showTitle: false,
            },
            render: (address) => (
                <Tooltip placement="topLeft" title={address}>
                    {address}
                </Tooltip>
            ),
        },
        {
            title: 'Details',
            key: 'details',
            render: (record) => (
                <Link to={`/admin/users/${record.key}`} className="view-details-link">View</Link>
            ),
        },
    ];

    const handleTableChange = (current, pageSize) => {
        console.log('current:', current, 'pageSize:', pageSize);
        setCurrentPage(current);
        setPageSize(pageSize);
    };

    const handleSave = async ({ key, field, value }) => {
        try {
            // Send the updated data to the server
            await Raxios.post('/user/engagementData', { key, field, value });

            // Update local state with the changed field
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
        <ConfigProvider theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
            <div key='parent-container' className='flex flex-col h-screen gap-2 p-10'>
                <div key='back-button-container' className='flex justify-end w-full'>
                    <button>
                        <FaArrowLeft className="back-icon" />
                    </button>
                </div>
                {loading ? <Loading /> :
                    <LazyLoad>
                        <Table
                            components={components}
                            dataSource={data}
                            columns={mergedColumns}
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                total: totalItems,
                                onChange: handleTableChange
                            }}
                            size='middle'
                            scroll={{
                                y: 'calc(100vh - 250px)',
                            }}
                        />
                    </LazyLoad>
                }
            </div>
        </ConfigProvider>
    );
};

export default UserEngagement;
