import React, { useRef, useState } from 'react';
import GetColumnSearchProps from '../../Utils/antTableHelper';
import { Table } from 'antd';
import { formatTime } from '../../Utils/formatHelper';

const EventUsersTable = ({ users }) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInputRef = useRef(null);

    const createColumn = (title, dataIndex, key, render, width) => {
        return {
            title,
            dataIndex,
            key,
            ...GetColumnSearchProps(dataIndex, title, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef),
            ...(render && { render }),
            ...(width && { width }),
        };
    };

    const columns = [
        createColumn('Name', 'name', 'name'),
        createColumn('Contact', 'phoneNumber', 'phoneNumber'),
        createColumn('Email', 'email', 'email'),
        createColumn('City', 'city', 'city'),
        createColumn('Created At', 'createdAt', 'createdAt', (time) => formatTime(time)),
        createColumn('Updated At', 'updatedAt', 'updatedAt', (time) => formatTime(time))
    ];

    return (
        <Table
            columns={columns}
            dataSource={users}
        />
    );
};

export default EventUsersTable;