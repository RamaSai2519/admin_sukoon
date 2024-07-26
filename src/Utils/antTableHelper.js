import React from 'react';
import { Input, Button, Space, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Raxios from '../services/axiosHelper';

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

const getFilterOptions = async (collection, field) => {
    try {
        const response = await Raxios.post('/data/generateFilters', { collection, field });
        return response.data;
    } catch (error) {
        console.error('Error in getFilterOptions', error);
        message.error('Error in generating filter options');
    }
};

export const handleFilterDropdownVisibleChange = async (collection, field, key, setFilters, filters) => {
    if (filters[key]) return;
    const filterOptions = await getFilterOptions(collection, field);
    setFilters(prevFilters => ({ ...prevFilters, [key]: filterOptions }));
};



export default getColumnSearchProps;
