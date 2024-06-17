import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUsers } from '../services/useData';
import writeXlsxFile from 'write-excel-file';
import { saveAs } from 'file-saver';
import LazyLoad from '../components/LazyLoad/lazyload';
import { ConfigProvider, theme, Table, Button, Flex, Radio } from 'antd';
import UserEngagement from '../UserEngagement';
import Loading from '../components/Loading/loading';
import { LoadingContext } from '../AdminDashboard/AdminDashboard';

const UsersList = () => {
  const { loading } = React.useContext(LoadingContext);
  const darkMode = localStorage.getItem('darkMode') === 'true';
  const [table, setTable] = useState(
    localStorage.getItem('table') === 'engagement' ? 'engagement' : 'users'
  );
  const { users, fetchUsers } = useUsers();

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
      render: (date) => new Date(date).toLocaleDateString(),
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
      render: (date) => new Date(date).toLocaleDateString(),
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
      render: (id) => <Link to={`/admin/users/${id}`}>
        <Button>
          View
        </Button>
      </Link>,
    },
  ];

  const downloadExcel = async () => {
    const wsData = [
      [
        { value: 'Name' },
        { value: 'City' },
        { value: 'Number' },
        { value: 'Joined Date' },
        { value: 'Birth Date' }
      ]
    ];
    users.forEach((user) => {
      wsData.push([
        { value: user.name },
        { value: user.city },
        { value: user.phoneNumber },
        { value: new Date(user.createdDate).toLocaleDateString() },
        { value: new Date(user.birthDate).toLocaleDateString() }
      ]);
    });
    const buffer = await writeXlsxFile(wsData, {
      headerStyle: {
        fontWeight: 'bold'
      },
      buffer: true
    });
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'UserList.xlsx');
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

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
          <Button onClick={downloadExcel}>
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
