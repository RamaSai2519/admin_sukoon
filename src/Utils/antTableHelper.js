import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Input, Button, Space } from 'antd';
import CallMissedIcon from '@mui/icons-material/CallMissed';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import { red, pink, green, yellow } from '@mui/material/colors';

const getColumnSearchProps = (dataIndex, displayName, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
            <Input
                ref={searchInputRef}
                placeholder={`Search ${displayName}`}
                value={selectedKeys[0]}
                onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex, setSearchText, setSearchedColumn)}
                style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex, setSearchText, setSearchedColumn)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90 }}
                >
                    Search
                </Button>
                <Button onClick={() =>
                    handleReset(clearFilters, confirm, setSearchText, setSearchedColumn)
                } size="small" style={{ width: 90 }}>
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

const handleSearch = (selectedKeys, confirm, dataIndex, setSearchText, setSearchedColumn) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
};

const handleReset = (clearFilters, confirm, setSearchText, setSearchedColumn) => {
    clearFilters();
    setSearchText('');
    setSearchedColumn('');
    confirm();
};

export const renderStatusIcon = (status) => {
    switch (status) {
        case 'failed':
            return <CloseIcon sx={{ color: red[500] }} />;
        case 'missed':
            return <CallMissedIcon sx={{ color: pink[500] }} />;
        case 'successful':
            return <CheckIcon sx={{ color: green[500] }} />;
        default:
            return <CallReceivedIcon sx={{ color: yellow[500] }} />;
    }
};


export default getColumnSearchProps;
