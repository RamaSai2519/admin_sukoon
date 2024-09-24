import React, { useEffect, useRef, useState } from 'react';
import CallsTableComponent from '../components/CallsTable';
import InternalToggle from '../components/InternalToggle';
import { raxiosFetchData } from '../services/fetchData';
import { downloadExcel } from '../Utils/exportHelper';
import { Button } from 'antd';

const CallsTable = () => {
  const searchInputRef = useRef(null);
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);
  const [internalView, setInternalView] = useState(
    localStorage.getItem('internalView') === 'true' ? true : false
  );
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem('currentCallsPage') ? parseInt(localStorage.getItem('currentCallsPage')) : 1
  );

  const fetchCalls = async () => {
    setLoading(true);
    await raxiosFetchData(
      currentPage, pageSize, setData, setTotalItems, '/call', { dest: 'list', internal: internalView }
    );
    setLoading(false);
  }

  useEffect(() => {
    fetchCalls();
    // eslint-disable-next-line
  }, [currentPage, pageSize, internalView]);

  const handleTableChange = (current, pageSize) => {
    setCurrentPage(current);
    localStorage.setItem('currentCallsPage', current);
    setPageSize(pageSize);
  };

  const exportData = async () => {
    setButtonLoading(true);
    const fileName = 'calls.xlsx';
    let callsData = await raxiosFetchData(1, totalItems, null, null, '/call', { dest: 'list', internal: internalView });
    callsData = callsData.data;
    await downloadExcel(callsData, fileName);
    setButtonLoading(false);
  };

  return (
    <div className='pt-5'>
      <div className='flex justify-between items-center w-full'>
        <h3 className='text-2xl font-bold'>{internalView ? "Internal" : "User"} Calls</h3>
        <div className='flex gap-5 items-center'>
          <InternalToggle internalView={internalView} setInternalView={setInternalView} disable={loading} />
          <Button loading={buttonLoading} onClick={exportData}>Export</Button>
        </div>
      </div>
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