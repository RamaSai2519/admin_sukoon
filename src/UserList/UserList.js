import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUsers } from '../services/useData';
import { formatDate } from '../Utils/formatHelper';
import { fetchEngagementData } from '../services/fetchData';
import LazyLoad from '../components/LazyLoad/lazyload';
import { ConfigProvider, theme, Table, Button, Flex, Radio } from 'antd';
import UserEngagement from '../UserEngagement';
import Loading from '../components/Loading/loading';
import { downloadExcel } from '../Utils/exportHelper';

const UsersList = () => {
  const [loading, setLoading] = useState(false);
  const darkMode = localStorage.getItem('darkMode') === 'true';
  const [table, setTable] = useState(
    localStorage.getItem('table') === 'engagement' ? 'engagement' : 'users'
  );
  const { users, fetchUsers } = useUsers();
  const [fetchLoading, setFetchLoading] = useState(false);

  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      filters: users.map((user) => ({ text: user.name, value: user.name })),
      filterSearch: true,
      onFilter: (value, record) => record.name.includes(value),
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      sorter: (a, b) => a.city.localeCompare(b.city),
      filters: users.reduce((acc, user) => {
        if (!acc.some((city) => city.text === user.city)) {
          acc.push({ text: user.city, value: user.city });
        }
        return acc;
      }, []).map((city) => ({ text: city.text, value: city.value })),
      filterSearch: true,
      onFilter: (value, record) => record.city.includes(value),
    },
    {
      title: 'Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
      filters: users.map((user) => ({ text: user.phoneNumber, value: user.phoneNumber })),
      filterSearch: true,
      onFilter: (value, record) => record.phoneNumber.includes(value),
    },
    {
      title: 'Joined Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
      filters: users.reduce((acc, user) => {
        if (!acc.some((date) => date.text === new Date(user.createdDate).toLocaleDateString())) {
          acc.push({ text: new Date(user.createdDate).toLocaleDateString(), value: new Date(user.createdDate).toLocaleDateString() });
        }
        return acc;
      }, []).map((date) => ({ text: date.text, value: date.value })),
      filterSearch: true,
      onFilter: (value, record) => record.createdDate.includes(value),
    },
    {
      title: 'DOB',
      dataIndex: 'birthDate',
      key: 'birthDate',
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.birthDate) - new Date(b.birthDate),
    },
    {
      title: 'Balance',
      dataIndex: 'numberOfCalls',
      key: 'numberOfCalls',
      sorter: (a, b) => a.numberOfCalls - b.numberOfCalls,
    },
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
      ,
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
      'POC': user.poc || 'N/A',
      'Name': user.name || 'N/A',
      'DOJ': user.createdDate || 'N/A',
      'SL Days': user.slDays || 0,
      'Call Status': user.callStatus || 'N/A',
      'User Status': user.userStatus || 'N/A',
      'Contact': user.phoneNumber || 'N/A',
      'City': user.city || 'N/A',
      'DOB': user.birthDate || 'N/A',
      'Gender': user.gender || 'N/A',
      'Last Call Date': user.lastCallDate || 'N/A',
      'Call Age': user.callAge || 0,
      'Calls': user.callsDone || 0,
      'Saarthi': user.expert || 'N/A',
      'Remarks': user.remarks || 'N/A'
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
    <ConfigProvider theme={
      {
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }
    }>

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
              <Radio.Button value="users">Users</Radio.Button>
              <Radio.Button value="engagement">Engagement</Radio.Button>
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
                dataSource={users}
                rowKey={(record) => record._id}
              />
            </LazyLoad>}
      </div>
    </ConfigProvider >
  );
};

export default UsersList;
