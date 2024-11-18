import React, { useEffect, useRef, useState } from 'react';
import CallsTableComponent from '../components/CallsTable';
import InternalToggle from '../components/InternalToggle';
import { raxiosFetchData } from '../services/fetchData';
import { useFilters } from '../services/useData';
import { useLocation } from 'react-router-dom';

const CallsTable = () => {
  const location = useLocation();
  const { filters = {} } = useFilters();
  const filter = filters[location.pathname] || {};

  const searchInputRef = useRef(null);
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [internalView, setInternalView] = useState(
    localStorage.getItem('internalView') === 'true' ? true : false
  );
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem('currentCallsPage') ? parseInt(localStorage.getItem('currentCallsPage')) : 1
  );

  const fetchCalls = async () => {
    setLoading(true);
    const response = await raxiosFetchData(
      currentPage, pageSize, setData, setTotalItems, '/actions/call', { dest: 'list', internal: internalView, ...filter }
    );
    setLoading(false);
    return response.data;
  }

  useEffect(() => {
    fetchCalls();
  }, [currentPage, pageSize, internalView, JSON.stringify(filter)]);

  const handleTableChange = (current, pageSize) => {
    setCurrentPage(current);
    localStorage.setItem('currentCallsPage', current);
    setPageSize(pageSize);
  };

  return (
    <div className='pt-5'>
      <div className='flex justify-between items-center w-full'>
        <h3 className='text-2xl font-bold'>{internalView ? "Internal" : "User"} Calls</h3>
        <div className='flex gap-5 items-center'>
          <InternalToggle internalView={internalView} setInternalView={setInternalView} disable={loading} />
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
        pathname={location.pathname}
      />
    </div>
  );
};

export default CallsTable;