import React, { useEffect, useRef, useState } from 'react';
import { raxiosFetchData } from '../services/fetchData';
import CallsTableComponent from '../components/CallsTable';

const CallsTable = () => {
  const searchInputRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem('currentCallsPage') ? parseInt(localStorage.getItem('currentCallsPage')) : 1
  );
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    setLoading(true);
    raxiosFetchData(currentPage, pageSize, setData, setTotalItems, '/call', { dest: 'list' });
    setLoading(false);
  }, [currentPage, pageSize]);

  const handleTableChange = (current, pageSize) => {
    setCurrentPage(current);
    localStorage.setItem('currentCallsPage', current);
    setPageSize(pageSize);
  };

  return (
    <CallsTableComponent
      data={data}
      loading={loading}
      searchText={searchText}
      setSearchText={setSearchText}
      searchedColumn={searchedColumn}
      setSearchedColumn={setSearchedColumn}
      searchInputRef={searchInputRef}
      pagination={{ current: currentPage, pageSize, total: totalItems, onChange: handleTableChange }}
    />
  );
};

export default CallsTable;