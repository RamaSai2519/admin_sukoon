import React, { useEffect, useRef, useState } from 'react';
import { raxiosFetchData } from '../../services/fetchData';
import { useCalls, useInsights, useStats } from '../../services/useData';
import CallsTableComponent from '../CallsTable';
import InternalToggle from '../InternalToggle';
import LazyLoad from '../LazyLoad/lazyload';

const LatestCallsTable = () => {
  const { fetchCalls } = useCalls();
  const { fetchStats } = useStats();
  const searchInputRef = useRef(null);
  const [data, setData] = useState([]);
  const { fetchInsights} = useInsights();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [internalView, setInternalView] = useState(
    localStorage.getItem('internalView') === 'true' ? true : false
  );

  const fetchData = async () => {
    setLoading(true);
    await raxiosFetchData(
      null, null, setData, null, '/call', { dest: 'home', internal: internalView }
    );
    fetchCalls(internalView);
    fetchStats(internalView);
    fetchInsights(internalView);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [internalView]);

  return (
    <LazyLoad>
      <div className='flex w-full items-center justify-between'>
        <h3 className='text-2xl font-bold'>Latest {internalView ? "Internal" : "User"} Calls</h3>
        <InternalToggle internalView={internalView} setInternalView={setInternalView} />
      </div>
      <CallsTableComponent
        data={data}
        size={"middle"}
        loading={loading}
        searchText={searchText}
        pagination={{ pageSize: 5 }}
        setSearchText={setSearchText}
        searchedColumn={searchedColumn}
        searchInputRef={searchInputRef}
        setSearchedColumn={setSearchedColumn}
      />
    </LazyLoad>
  );
};

export default LatestCallsTable;
