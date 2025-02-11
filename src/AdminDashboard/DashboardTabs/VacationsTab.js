import React, { useEffect, useRef, useState } from "react";
import { Table } from "antd";
import { useLocation } from "react-router-dom";
import { useFilters } from "../../contexts/useData";
import { formatDate } from "../../Utils/formatHelper";
import Loading from "../../components/Loading/loading";
import LazyLoad from "../../components/LazyLoad/lazyload";
import { raxiosFetchData } from "../../services/fetchData";
import GetColumnSearchProps from "../../Utils/antTableHelper";


const VacationsTab = () => {
    const location = useLocation();
    const { filters = {} } = useFilters();
    const filter = filters[location.pathname] || {};

    const [vacations, setVacations] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [totalVacations, setTotalVacations] = useState(0);
    const [page, setPage] = useState(
        localStorage.getItem('vacationsPage') ? parseInt(localStorage.getItem('vacationsPage')) : 1
    );
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInputRef = useRef(null);

    useEffect(() => {
        raxiosFetchData(page, pageSize, setVacations, setTotalVacations, '/actions/vacation', filter, setLoading);
        // eslint-disable-next-line
    }, [page, pageSize, JSON.stringify(filter)]);

    const createColumn = (title, dataIndex, key, render, width, filter = true) => {
        return {
            title,
            dataIndex,
            key,
            ...GetColumnSearchProps(dataIndex, title, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef, location.pathname, filter),
            ...(render && { render }),
            ...(width && { width }),
        };
    };

    const columns = [
        createColumn('Name', 'user', 'user'),
        createColumn('Start Date', 'start_date', 'start_date', (time) => formatDate(time), null, false),
        createColumn('End Date', 'end_date', 'end_date', (time) => formatDate(time), null, false),
        createColumn('Start Time', 'start_time', 'start_time'),
        createColumn('End Time', 'end_time', 'end_time')
    ]

    return (
        <div className='min-h-screen p-5 w-full overflow-auto flex lg:flex-row flex-col h-max '>
            <LazyLoad>
                {loading ? <Loading /> : <Table
                    dataSource={vacations}
                    columns={columns}
                    rowKey={(record) => record._id}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: totalVacations,
                        onChange: (current, pageSize) => {
                            setPage(current);
                            localStorage.setItem('vacationsPage', current);
                            setPageSize(pageSize);
                        },
                    }}
                />}
            </LazyLoad>
        </div>
    );
};

export default VacationsTab;