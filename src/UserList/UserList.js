import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useUsers } from '../services/useData';
import { formatDate } from '../Utils/formatHelper';
import { fetchEngagementData } from '../services/fetchData';
import LazyLoad from '../components/LazyLoad/lazyload';
import { Table, Button, Flex, Radio } from 'antd';
import UserEngagement from '../UserEngagement';
import Loading from '../components/Loading/loading';
import { downloadExcel } from '../Utils/exportHelper';
import getColumnSearchProps from '../Utils/antTableHelper';

const UsersList = () => {
  const [loading, setLoading] = useState(false);
  const [table, setTable] = useState(
    localStorage.getItem('table') === 'engagement' ? 'engagement' : 'users'
  );
  const { users, fetchUsers } = useUsers();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInputRef = useRef(null);

  const createColumn = (title, dataIndex, key, render) => {
    return {
      title,
      dataIndex,
      key,
      ...getColumnSearchProps(dataIndex, title, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef),
      ...(render && { render }),
    };
  };

  const columns = [
    createColumn('User', 'name', 'name'),
    createColumn('City', 'city', 'city'),
    createColumn('Number', 'phoneNumber', 'phoneNumber'),
    createColumn('Ref Source', 'refSource', 'refSource'),
    { title: 'Joined Date', dataIndex: 'createdDate', key: 'createdDate', render: (date) => formatDate(date), sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate) },
    { title: 'DOB', dataIndex: 'birthDate', key: 'birthDate', render: (date) => formatDate(date), sorter: (a, b) => new Date(a.birthDate) - new Date(b.birthDate) },
    createColumn('Balance', 'numberOfCalls', 'numberOfCalls'),
    {
      title: 'Details',
      dataIndex: '_id',
      key: 'details',
      render: (id) =>
        <div className='flex gap-2'>
          <Link to={`/admin/users/${id}`}>
            <Button>
              View
            </Button>
          </Link>
          <Link to={`/admin/users/${id}#notifications-table`}>
            <Button>
              WA Texts
            </Button>
          </Link>
        </div>
    },
  ];

  const downloadUsersExcel = async () => {
    const dataToWrite = users.map((user) => ({
      'Name': user.name,
      'City': user.city,
      'Number': user.phoneNumber,
      'Joined Date': formatDate(user.createdDate),
      'Birth Date': formatDate(user.birthDate),
    }));

    await downloadExcel(dataToWrite, 'UserList.xlsx');
  };

  const downloadEngagementExcel = async () => {
    setFetchLoading(true);
    const data = await fetchEngagementData(1, 10000);
    setFetchLoading(false);

    const dataToWrite = data.data.map((user) => ({
      'POC': user.poc || '',
      'Name': user.name || '',
      'DOJ': formatDate(user.createdDate) || '',
      'SL Days': user.slDays || 0,
      'Call Status': user.callStatus || '',
      'User Status': user.userStatus || '',
      'Contact': user.phoneNumber || '',
      'City': user.city || '',
      'DOB': formatDate(user.birthDate) || '',
      'Gender': user.gender || '',
      'Last Call Date': formatDate(user.lastCallDate) || '',
      'Call Age': user.callAge || 0,
      'Calls': user.callsDone || 0,
      'Saarthi': user.expert || '',
      'Remarks': user.remarks || '',
      'Source': user.source || '',
      'Ref Source': user.refSource || '',
    }));

    await downloadExcel(dataToWrite, 'UserEngagement.xlsx');
  };

  const fetchdata = async () => {
    setLoading(true);
    await fetchUsers();
    setLoading(false);
  };

  useEffect(() => {
    fetchdata();
    // eslint-disable-next-line
  }, []);

  const handleExport = () => {
    if (table === 'engagement') {
      downloadEngagementExcel();
    } else {
      downloadUsersExcel();
    }
  };

  return (
    <div className="min-h-screen p-5 w-full overflow-auto">
      <div className="flex w-full justify-between items-center gap-2">
        <Flex vertical>
          <Radio.Group
            value={table}
            onChange={(e) => {
              localStorage.setItem('table', e.target.value);
              setTable(e.target.value);
            }}
          >
            <Radio.Button value="users">Registered Users</Radio.Button>
            <Radio.Button value="engagement">Registered Users + Leads</Radio.Button>
          </Radio.Group>
        </Flex>
        <Button loading={fetchLoading} onClick={handleExport}>
          Export
        </Button>
      </div>
      {table === 'engagement' ? <UserEngagement /> :
        loading ? <Loading /> :
          <LazyLoad>
            <Table
              className='my-5'
              columns={columns}
              dataSource={users.filter((user) => user.profileCompleted)}
              rowKey={(record) => record._id}
            />
          </LazyLoad>}
    </div>
  );
};

export default UsersList;
