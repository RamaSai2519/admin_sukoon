import React, { useEffect, useRef, useState } from 'react';
import { useCalls, useExperts, useInsights, useStats } from '../../contexts/useData';
import { raxiosFetchData } from '../../services/fetchData';
import InsightsTable from '../../components/DataTable';
import CallsTableComponent from '../CallsTable';
import InternalToggle from '../InternalToggle';
import LazyLoad from '../LazyLoad/lazyload';
import { Button } from 'antd';

const LatestCallsTable = () => {
  const { fetchExperts } = useExperts();
  const { fetchCalls } = useCalls();
  const { fetchStats } = useStats();
  const searchInputRef = useRef(null);
  const [data, setData] = useState([]);
  const { fetchInsights } = useInsights();
  const [visible, setVisible] = useState(false);
  const [disable, setDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [internalView, setInternalView] = useState(
    localStorage.getItem('internalView') === 'true' ? true : false
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem('currentPage')) || 1
  );

  const fetchData = async () => {
    setLoading(true);
    setDisable(true);
    await fetchStats(internalView);
    await raxiosFetchData(
      null, null, setData, null, '/actions/call', { dest: 'home', internal: internalView }
    );
    setLoading(false);
    await fetchInsights(internalView);
    await fetchCalls(internalView);
    await fetchExperts(internalView);
    setDisable(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [internalView]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    localStorage.setItem('currentPage', page);
  };

  return (
    <LazyLoad>
      <div className='flex w-full items-center justify-between'>
        <h3 className='text-2xl font-bold'>Latest {internalView ? "Internal" : "User"} Calls</h3>
        <div className='flex items-center justify-center gap-5'>
          <Button onClick={() => setVisible(true)}>View Insights</Button>
          <InternalToggle internalView={internalView} setInternalView={setInternalView} disable={disable} />
        </div>
      </div>
      <CallsTableComponent
        data={data}
        size={"middle"}
        loading={loading}
        searchText={searchText}
        pagination={{ pageSize: 5, current: currentPage, onChange: handlePageChange }}
        setSearchText={setSearchText}
        searchedColumn={searchedColumn}
        searchInputRef={searchInputRef}
        setSearchedColumn={setSearchedColumn}
      />
      {visible && <InsightsTable visible={visible} setVisible={setVisible} />}
    </LazyLoad>
  );
};

export default LatestCallsTable;
