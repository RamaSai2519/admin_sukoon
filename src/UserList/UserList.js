import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useUsers } from '../services/useData';
import UserEngagement from '../UserEngagement';
import { Table, Button, Flex, Radio } from 'antd';
import { formatDate } from '../Utils/formatHelper';
import Loading from '../components/Loading/loading';
import { downloadExcel } from '../Utils/exportHelper';
import LazyLoad from '../components/LazyLoad/lazyload';
import getColumnSearchProps from '../Utils/antTableHelper';

const UsersList = () => {
  const searchInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [table, setTable] = useState(
    localStorage.getItem('table') === 'engagement' ? 'engagement' : 'users'
  );
  const { users, fetchUsers } = useUsers();
  const [searchText, setSearchText] = useState('');
  const [engFileUrl, setEngFileURL] = useState('');
  const [fetchLoading, setFetchLoading] = useState(false);
  const [searchedColumn, setSearchedColumn] = useState('');

  const createColumn = (title, dataIndex, key, render) => {
    return {
      title, dataIndex, key,
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
      key: 'details',
      render: (record) =>
        <div className='flex gap-2'>
          <Link to={`/admin/users/${record._id}`}>
            <Button onClick={() => localStorage.setItem('userNumber', record.phoneNumber)}>
              View
            </Button>
          </Link>
          <Link to={`/admin/users/${record._id}#notifications-table`}>
            <Button onClick={() => localStorage.setItem('userNumber', record.phoneNumber)}>
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
    window.open(engFileUrl);
    setFetchLoading(false);
  };

  const fetchdata = async () => {
    setLoading(true);
    await fetchUsers();
    setLoading(false);
  };

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ engFileUrl:", engFileUrl)

  }, [engFileUrl]);

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
      {table === 'engagement' ? <UserEngagement setExportFileUrl={setEngFileURL} /> :
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
