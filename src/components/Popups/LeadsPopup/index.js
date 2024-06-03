import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Table, Input, Button, Space, ConfigProvider, theme } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const LeadsPopup = ({ users, onClose }) => {
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
        onFilterDropdownVisibleChange: (visible) => {
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
            title: 'Date Joined',
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
            title: 'Date of Birth',
            dataIndex: 'birthDate',
            key: 'birthDate',
            ...getColumnSearchProps('birthDate', 'Date of Birth'),
            sorter: (a, b) => new Date(a.birthDate) - new Date(b.birthDate),
            render: (birthDate) =>
                new Date(birthDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                }),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, user) => (
                <Link to={`/admin/users/${user._id}`} className="view-details-link">
                    View
                </Link>
            ),
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

    return (
        <div className="fixed left-0 top-0 overflow-auto w-full h-full bg-black bg-opacity-50 ">
            <div className="p-10 rounded-5 rounded-10 shadow-md min-w-1/2 max-w-90 max-h-90 overflow-y-auto relative"> 
                <div className='w-fit mx-auto h-auto'>
                    <div className="flex flex-row m-5 justify-end">
                        <button className="pback-button" onClick={onClose}>X</button>
                    </div>
                    {users.length > 0 ? (
                        <ConfigProvider theme={{
                            algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                        }}>
                            <Table dataSource={users.reverse()} columns={columns} />
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
