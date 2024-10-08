import { Button, Table } from 'antd';
import { Link } from 'react-router-dom';
import LazyLoad from '../LazyLoad/lazyload';
import { formatTime } from '../../Utils/formatHelper';
import getColumnSearchProps, { renderStatusIcon } from '../../Utils/antTableHelper';

const CallsTableComponent = ({
    data,
    loading,
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn,
    searchInputRef,
    pagination,
    size
}) => {

    const createColumn = (title, dataIndex, key, render) => {
        return {
            title,
            dataIndex,
            key,
            ...getColumnSearchProps(
                dataIndex,
                title,
                searchText,
                setSearchText,
                searchedColumn,
                setSearchedColumn,
                searchInputRef
            ),
            ...(render && { render }),
        };
    };

    const columns = [
        createColumn('User', 'user', 'user', (_, record) => (
            <span>
                {renderStatusIcon(record.status)} {record.user}
            </span>
        )),
        createColumn('Expert', 'expert', 'expert'),
        createColumn('Time', 'initiatedTime', 'initiatedTime', (date) => formatTime(date)),
        createColumn('Duration', 'duration', 'duration'),
        createColumn('Status', 'status', 'status'),
        createColumn('Source', 'source', 'source'),
        createColumn('Score', 'conversationScore', 'score'),
        {
            title: 'Details',
            key: 'details',
            render: (record) => (
                <Link to={`/admin/calls/${record.callId}`}>
                    <Button>View</Button>
                </Link>
            ),
        },
    ];

    return (
        <LazyLoad>
            <Table
                className="w-full overflow-auto pt-5"
                rowKey={(record) => record.callId}
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={pagination}
                size={size}
            />
        </LazyLoad>
    );
};

export default CallsTableComponent;