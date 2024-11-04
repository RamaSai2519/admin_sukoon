import React from 'react';
import { Input, Button, Space } from 'antd';
import { useFilters } from '../services/useData';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { SearchOutlined } from '@ant-design/icons';
import CallMissedIcon from '@mui/icons-material/CallMissed';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import { red, pink, green, yellow } from '@mui/material/colors';


const GetColumnSearchProps = (dataIndex, displayName, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef, pathname = null, filter = false) => {
    const { setFilters } = useFilters();

    const handleSearch = (selectedKeys, confirm) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        if (pathname) {
            setFilters((prevFilters) => ({
                ...prevFilters,
                [pathname]: { filter_field: dataIndex, filter_value: selectedKeys[0] }
            }));
        }
    };

    const handleReset = (clearFilters, confirm) => {
        clearFilters();
        setSearchText('');
        setSearchedColumn('');
        confirm();
        if (pathname) {
            setFilters((prevFilters) => {
                const newFilters = { ...prevFilters };
                delete newFilters[pathname];
                return newFilters;
            });
        }
    };

    if (!filter) {
        return {
            sorter: (a, b) => {
                return a[dataIndex] && b[dataIndex] ? a[dataIndex].localeCompare(b[dataIndex]) : 0;
            },
        };
    }

    return {
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInputRef}
                    placeholder={`Search ${displayName}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters, confirm)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInputRef.current?.select(), 100);
            }
        },
        sorter: (a, b) => {
            return a[dataIndex] && b[dataIndex] ? a[dataIndex].localeCompare(b[dataIndex]) : 0;
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <span>
                    {text
                        ?.toString()
                        .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))
                        .map((fragment, i) =>
                            fragment.toLowerCase() === searchText ? (
                                <span key={i} style={{ backgroundColor: '#ffc069' }}>
                                    {fragment}
                                </span>
                            ) : (
                                fragment
                            )
                        )}
                </span>
            ) : (
                text
            ),
    };
};

export const renderStatusIcon = (status) => {
    switch (status) {
        case 'failed':
            return <CloseIcon sx={{ color: red[500] }} />;
        case 'missed':
            return <CallMissedIcon sx={{ color: pink[500] }} />;
        case 'successful':
            return <CheckIcon sx={{ color: green[500] }} />;
        case 'inadequate':
            return <ErrorOutlineIcon sx={{ color: yellow[900] }} />;
        default:
            return <CallReceivedIcon sx={{ color: yellow[500] }} />;
    }
};

export default GetColumnSearchProps;