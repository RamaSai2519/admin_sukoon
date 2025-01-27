import React, { useState, useRef, useEffect } from 'react';
import { Table } from 'antd';
import Loading from '../../Loading/loading';
import { useLocation } from 'react-router-dom';
import { useFilters } from '../../../contexts/useData';
import { formatDate } from '../../../Utils/formatHelper';
import { raxiosFetchData } from '../../../services/fetchData';
import GetColumnSearchProps from '../../../Utils/antTableHelper';

const Popup = ({ users_type, onClose }) => {
  const location = useLocation();
  const { filters = {} } = useFilters();
  const filter = filters[location.pathname] || {};

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(
    localStorage.getItem('callUsersPage') ? parseInt(localStorage.getItem('callUsersPage')) : 1
  );
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInputRef = useRef(null);

  const createColumn = (title, dataIndex, key, filter = false) => {
    return {
      key,
      title,
      dataIndex,
      ...GetColumnSearchProps(dataIndex, title, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef, location.pathname, filter),
    };
  };
  const columns = [
    createColumn('Name', 'name', 'name', true),
    { title: 'DOB', dataIndex: 'birthDate', key: 'birthDate', render: (date) => formatDate(date), sorter: (a, b) => new Date(a.birthDate) - new Date(b.birthDate) },
    { title: 'Joined Date', dataIndex: 'createdDate', key: 'createdDate', render: (date) => formatDate(date), sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate) },
  ];

  const fetchData = async () => {
    const optional = { ...filter, type: users_type };
    await raxiosFetchData(page, pageSize, setData, setTotal, '/actions/leads', optional, setLoading);
  };

  // eslint-disable-next-line
  useEffect(() => { fetchData() }, [page, pageSize, JSON.stringify(filter)]);
  if (loading) { return <Loading /> }

  return (
    <div className="fixed left-0 top-0 overflow-auto w-full h-full bg-black bg-opacity-50 ">
      <div className="p-10 rounded-5 rounded-10 shadow-md min-w-1/2 max-w-90 max-h-90 overflow-y-auto relative">
        <div className='w-fit mx-auto h-auto'>
          <div className="flex flex-row m-5 justify-end">
            <button className="pback-button" onClick={onClose}>X</button>
          </div>
          {data.length > 0 ? (
            <Table
              dataSource={data}
              columns={columns}
              rowKey={(user) => user._id}
              pagination={{
                total: total,
                current: page,
                pageSize: pageSize,
                onChange: (current, pageSize) => {
                  setPage(current);
                  localStorage.setItem('callUsersPage', current);
                  setPageSize(pageSize);
                }
              }}
            />
          ) : (
            <p>No users to display</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
