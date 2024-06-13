import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Table, Input, Button, Space, ConfigProvider, theme, Popconfirm } from 'antd';
import { SearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useLeads } from '../../../services/useData';
import EditableCell from '../../EditableCell';
import Raxios from '../../../services/axiosHelper';

const LeadsPopup = ({ onClose }) => {
    const { leads } = useLeads();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInputRef = useRef(null);
    const darkMode = localStorage.getItem('darkMode') === 'true';

    const getColumnSearchProps = (dataIndex, displayName) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInputRef}
                    placeholder={`Search ${displayName}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters, confirm)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInputRef.current.select(), 100);
            }
        },
        sorter: (a, b) => {
            return a[dataIndex] && b[dataIndex] ? a[dataIndex].localeCompare(b[dataIndex]) : 0;
        },
        render: (text) => {
            return searchedColumn === dataIndex ? (
                <span>
                    {text &&
                        text
                            .toString()
                            .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))
                            .map((fragment, i) =>
                                fragment && typeof fragment === 'string' ? (
                                    fragment.toLowerCase() === searchText ? (
                                        <span key={i} style={{ backgroundColor: '#ffc069' }}>
                                            {fragment}
                                        </span>
                                    ) : (
                                        fragment
                                    )
                                ) : (
                                    fragment
                                )
                            )}
                </span>
            ) : (
                text
            );
        },
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name', 'Name'),
        },
        {
            title: 'Contact',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            ...getColumnSearchProps('phoneNumber', 'Contact'),
        },
        {
            title: 'City',
            dataIndex: 'city',
            key: 'city',
            ...getColumnSearchProps('city', 'City'),
        },
        {
            title: 'Date of Lead',
            dataIndex: 'createdDate',
            key: 'createdDate',
            ...getColumnSearchProps('createdDate', 'Date Joined'),
            sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
            render: (createdDate) =>
                new Date(createdDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                }),
        },
        {
            title: 'Source',
            dataIndex: 'source',
            key: 'source',
            ...getColumnSearchProps('source', 'Source'),
            sorter: (a, b) => a.source.localeCompare(b.source),
        },
        {
            title: "Remarks", dataIndex: "remarks",
            key: "remarks", width: 250, editable: true,
            ...getColumnSearchProps('remarks', 'Remarks')
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (user) => {
                if (user.source === 'Users Lead') {
                    return (
                        <Link to={`/admin/users/${user._id}`}>
                            <Button className='w-full'>
                                View
                            </Button>
                        </Link>
                    );
                } else {
                    return (
                        <Popconfirm
                            title="Delete the record"
                            description="Are you sure to delete this record?"
                            onConfirm={() => confirm(user)}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                            icon={
                                <QuestionCircleOutlined
                                    style={{
                                        color: 'red',
                                    }} />
                            }
                        >
                            <Button>Delete</Button>
                        </Popconfirm>
                    );
                }
            },
        },
    ];

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters, confirm) => {
        clearFilters();
        setSearchText('');
        setSearchedColumn('');
        confirm();
    };

    const handleSave = async ({ key, field, value }) => {
        try {
            await Raxios.post('/user/leadRemarks', { key, field, value })
                .then((response) => {
                    if (response.request.status === 200) {
                        window.alert('Lead updated successfully');
                        window.location.reload();
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const confirm = (user) => {
        Raxios.post(`/user/leads`, { user })
            .then((response) => {
                console.log(response);
                if (response.request.status === 200) {
                    window.alert('Lead deleted successfully');
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const cancel = (e) => {
        console.log(e);
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
        <div className="fixed left-0 top-0 overflow-auto w-full h-full bg-black bg-opacity-50 ">
            <div className="p-10 rounded-5 rounded-10 shadow-md min-w-1/2 max-w-90 max-h-90 overflow-y-auto relative">
                <div className='w-fit mx-auto h-auto'>
                    <div className="flex flex-row m-5 justify-end">
                        <button className="pback-button" onClick={onClose}>X</button>
                    </div>
                    {leads.length > 0 ? (
                        <ConfigProvider theme={{
                            algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                        }}>
                            <Table
                                components={components}
                                dataSource={leads}
                                columns={mergedColumns}
                                rowKey={(user) => user._id}
                            />
                        </ConfigProvider>
                    ) : (
                        <p>No users to display</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeadsPopup;
