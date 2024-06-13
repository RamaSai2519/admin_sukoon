import React from 'react';
import { Link } from 'react-router-dom';
import { Table, ConfigProvider, theme } from 'antd';
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
        _id: item._id,
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
        saarthi: item.saarthi
    }));

    const columns = [
        {
            title: "POC", dataIndex: "poc", key: "poc", width: 100, editable: true,
            filters: data.reduce((uniquePocs, item) => {
                if (!uniquePocs.includes(item.poc)) {
                    uniquePocs.push(item.poc);
                }
                return uniquePocs;
            }, []).map((poc) => ({ text: poc, value: poc })),
            filterSearch: true,
            onFilter: (value, record) => record.poc.includes(value)
        },
        {
            title: "Name", dataIndex: "name", key: "name", width: 150, fixed: 'left',
            filters: data.map((item) => ({ text: item.name, value: item.name })),
            filterSearch: true,
            onFilter: (value, record) => record.name.includes(value),
        },
        { title: "DOJ / Days in SL", dataIndex: "createdDate", key: "createdDate", width: 135 },
        { title: "Status", dataIndex: "status", key: "status", width: 100, editable: true },
        { title: "Contact", dataIndex: "phoneNumber", key: "phoneNumber", width: 120 },
        {
            title: "City", dataIndex: "city", key: "city", width: 110,
            filters: data.reduce((uniqueCities, item) => {
                if (!uniqueCities.includes(item.city)) {
                    uniqueCities.push(item.city);
                }
                return uniqueCities;
            }, []).map((city) => ({ text: city, value: city })),
            filterSearch: true,
            onFilter: (value, record) => record.city.includes(value)
        },
        { title: "DOB / Age", dataIndex: "dateOfBirth", key: "dateOfBirth", width: 135 },
        { title: "Gender", dataIndex: "gender", key: "gender", width: 90, editable: true },
        { title: "Last Call Date / Call Age", dataIndex: "lastCallDate", key: "lastCallDate", width: 135 },
        { title: "Calls", dataIndex: "callsDone", key: "callsDone", width: 70 },
        { title: "Saarthi", dataIndex: "saarthi", key: "saarthi", width: 100, editable: true },
        { title: "Remarks", dataIndex: "remarks", key: "remarks", width: 250, editable: true, },
        {
            title: 'Details',
            key: 'details',
            width: 100,
            fixed: 'right',
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
            <div key='parent-container' className='flex flex-col h-screen gap-2 p-10 pt-2 overflow-auto'>
                <div key='back-button-container' className='flex justify-end w-full'>
                    <button className='back-button' onClick={() => window.history.back()}>
                        <FaArrowLeft className="back-icon" />
                    </button>
                </div>
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
        </ConfigProvider>
    );
};

export default UserEngagement;
