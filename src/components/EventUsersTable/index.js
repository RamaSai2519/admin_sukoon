import React, { useRef, useState } from 'react';
import GetColumnSearchProps from '../../Utils/antTableHelper';
import { Table } from 'antd';
import { formatTime } from '../../Utils/formatHelper';

const EventUsersTable = ({ users, pathname, contribute }) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInputRef = useRef(null);

    const createColumn = (title, dataIndex, key, render, width, filter = true) => {
        return {
            title,
            dataIndex,
            key,
            ...GetColumnSearchProps(dataIndex, title, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef, pathname, filter),
            ...(render && { render }),
            ...(width && { width }),
        };
    };

    const columns = [
        createColumn('Name', 'name', 'name'),
        createColumn('Contact', 'phoneNumber', 'phoneNumber'),
        ...(!contribute ? [createColumn('Email', 'email', 'email')] : []),
        createColumn('City', 'city', 'city'),
        ...(!contribute ? [createColumn('User Paid', 'isUserPaid', 'isUserPaid', (isUserPaid) => isUserPaid ? 'Yes' : 'No', null, false)] : []),
        createColumn('Created At', 'createdAt', 'createdAt', (time) => formatTime(time), '', false),
        createColumn('Updated At', 'updatedAt', 'updatedAt', (time) => formatTime(time), '', false),
    ];

    return (
        <Table
            columns={columns}
            dataSource={users}
        />
    );
};

export default EventUsersTable;