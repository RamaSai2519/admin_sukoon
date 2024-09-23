import React, { useEffect, useRef, useState } from 'react';
import { raxiosFetchData } from '../services/fetchData';
import CallsTableComponent from '../components/CallsTable';
import { downloadExcel } from '../Utils/exportHelper';
import { Button } from 'antd';

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
  const [buttonLoading, setButtonLoading] = useState(false);

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

  const exportData = async () => {
    setButtonLoading(true);
    const fileName = 'calls.xlsx';
    let callsData = await raxiosFetchData(1, totalItems, null, null, '/call', { dest: 'list' });
    callsData = callsData.data;
    await downloadExcel(callsData, fileName);
    setButtonLoading(false);
  }

  return (
    <div className='flex flex-col items-end pt-5'>
      <Button loading={buttonLoading} onClick={exportData}>Export</Button>
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
    </div>
  );
};

export default CallsTable;