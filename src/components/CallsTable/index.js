import { Button, Table } from 'antd';
import { Link } from 'react-router-dom';
import LazyLoad from '../LazyLoad/lazyload';
import { useAdmin } from '../../services/useData';
import { formatTime } from '../../Utils/formatHelper';
import GetColumnSearchProps, { renderStatusIcon } from '../../Utils/antTableHelper';

const CallsTableComponent = ({
    data,
    loading,
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn,
    searchInputRef,
    pagination,
    size,
    pathname = null,
}) => {
    const { admin } = useAdmin();

    const createColumn = (title, dataIndex, key, render, filter = true) => {
        return {
            title,
            dataIndex,
            key,
            ...GetColumnSearchProps(
                dataIndex,
                title,
                searchText,
                setSearchText,
                searchedColumn,
                setSearchedColumn,
                searchInputRef,
                pathname,
                filter
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
        createColumn('Time', 'initiatedTime', 'initiatedTime', (date) => formatTime(date), false),
        createColumn('Duration', 'duration', 'duration'),
        createColumn('Status', 'status', 'status'),
        createColumn('Reason', 'failedReason', 'failedReason'),
        createColumn('Source', 'source', 'source'),
        createColumn('Score', 'conversationScore', 'score'),
        ...(admin.access_level !== 'basic' ? [{
            title: 'Details',
            key: 'details',
            render: (record) => (
                <Link to={`/admin/calls/${record.callId}`}>
                    <Button>View</Button>
                </Link>
            ),
        }] : []),
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