import React, { useEffect, useRef, useState } from 'react';
import { raxiosFetchData } from '../../services/fetchData';
import CallsTableComponent from '../CallsTable';
import LazyLoad from '../LazyLoad/lazyload';

const LastFiveCallsTable = () => {
  const searchInputRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  useEffect(() => {
    setLoading(true);
    raxiosFetchData(
      null, null, setData, null, '/call', { dest: 'home' }
    );
    setLoading(false);
  }, []);

  return (
    <div className='w-full h-full'>
      <LazyLoad>
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
    </div>
  );
};

export default LastFiveCallsTable;
