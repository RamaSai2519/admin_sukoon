import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, ConfigProvider, theme } from 'antd';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMissedIcon from '@mui/icons-material/CallMissed';
import { red, pink, green, yellow } from '@mui/material/colors';
import { useCalls } from '../../services/useData';

const LastFiveCallsTable = () => {
  const { calls } = useCalls();
  const [lastFiveCalls, setLastFiveCalls] = useState([]);
  const darkMode = localStorage.getItem('darkMode') === 'true';

  useEffect(() => {
    const todayCalls = calls.filter(call => {
      const callDate = new Date(call.initiatedTime);
      const today = new Date();
      return (
        callDate.getDate() === today.getDate() &&
        callDate.getMonth() === today.getMonth() &&
        callDate.getFullYear() === today.getFullYear()
      );
    });

    if (todayCalls.length > 0) {
      setLastFiveCalls(todayCalls);
    } else {
      setLastFiveCalls(calls.slice(0, 5));
    }
  }, [calls]);

  const columns = [
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      sorter: (a, b) => a.userName.localeCompare(b.userName),
      render: (text, record) => (
        <span>
          {renderStatusIcon(record.status)} {text}
        </span>
      ),
    },
    {
      title: 'Expert',
      dataIndex: 'expertName',
      key: 'expertName',
      sorter: (a, b) => a.expertName.localeCompare(b.expertName),
    },
    {
      title: 'Time',
      dataIndex: 'initiatedTime',
      key: 'initiatedTime',
      sorter: (a, b) => new Date(a.initiatedTime) - new Date(b.initiatedTime),
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Details',
      key: 'details',
      render: (text, record) => (
        <Link to={`/admin/calls/${record.callId}`} className="view-details-link">
          View
        </Link>
      ),
    },
  ];

  const renderStatusIcon = (status) => {
    switch (status) {
      case 'failed':
        return <CloseIcon style={{ color: red[500] }} />;
      case 'missed':
        return <CallMissedIcon style={{ color: pink[500] }} />;
      case 'successful':
        return <CheckIcon style={{ color: green[500] }} />;
      default:
        return <CallReceivedIcon style={{ color: yellow[500] }} />;
    }
  };

  return (
    <ConfigProvider theme={{
      algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    }}>
      <Table
        dataSource={lastFiveCalls}
        columns={columns}
        pagination={{ pageSize: 5 }} 
        className="w-full h-full mt-2"
        rowKey={(record) => record.callId}
      />
    </ConfigProvider>
  );
};

export default LastFiveCallsTable;
