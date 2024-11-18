import { Button, Table } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import GetColumnSearchProps from '../../Utils/antTableHelper';
import { raxiosFetchData } from '../../services/fetchData';
import Loading from '../../components/Loading/loading';
import { formatTime } from '../../Utils/formatHelper';
import { Link } from 'react-router-dom';

const ClubSukoon = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = React.useState(
        localStorage.getItem('clubCurrentPage') ? parseInt(localStorage.getItem('clubCurrentPage')) : 1
    );
    const [pageSize, setPageSize] = React.useState(10);
    const [totalItems, setTotalItems] = React.useState(0);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        raxiosFetchData(currentPage, pageSize, setData, setTotalItems, '/actions/club', null, setLoading);
    }, [currentPage, pageSize]);

    const createColumn = (title, dataIndex, key, render) => {
        return {
            title,
            dataIndex,
            key,
            ...GetColumnSearchProps(dataIndex, title, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef),
            ...(render && { render }),
        };
    };

    const columns = [
        createColumn('Name', 'name', 'name'),
        createColumn('Phone Number', 'phoneNumber', 'phoneNumber'),
        createColumn('Interest Shown At', 'createdAt', 'createdAt', (record) => formatTime(record)),
        {
            title: 'Actions', key: 'actions', render: (record) =>
                <Link to={`/admin/users/${record.key}`}>
                    <Button onClick={() => localStorage.setItem('userNumber', record.phoneNumber)}>
                        View
                    </Button>
                </Link>
        }
    ];

    const handleTableChange = (current, pageSize) => {
        setCurrentPage(current);
        localStorage.setItem('clubCurrentPage', current);
        setPageSize(pageSize);
    };

    if (loading) return <Loading />;

    return (
        <div className='mt-5'>
            <Table
                dataSource={data}
                columns={columns}
                rowKey={(record) => record._id}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalItems,
                    onChange: handleTableChange
                }}
            />
        </div>
    );
};

export default ClubSukoon;