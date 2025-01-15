import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useFilters } from "../../contexts/useData";
import { raxiosFetchData } from "../../services/fetchData";
import GetColumnSearchProps from "../../Utils/antTableHelper";
import LazyLoad from "../../components/LazyLoad/lazyload";
import Loading from "../../components/Loading/loading";
import { Button, Table } from "antd";
import UpsertPlanForm from "../../components/UpsertPlanForm";


const PlansTab = () => {
    const location = useLocation();
    const { filters = {} } = useFilters();
    const filter = filters[location.pathname] || {};

    const [plan, setPlan] = useState(null);
    const [plans, setPlans] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [totalPlans, setTotalPlans] = useState(0);
    const [page, setPage] = useState(
        localStorage.getItem('plansPage') ? parseInt(localStorage.getItem('plansPage')) : 1
    );
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInputRef = useRef(null);

    useEffect(() => {
        raxiosFetchData(page, pageSize, setPlans, setTotalPlans, '/actions/sub_plans', filter, setLoading);
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
        createColumn('Name', 'name', 'name'),
        createColumn('Price', 'price', 'price'),
        createColumn('Free Events', 'free_events', 'free_events'),
        createColumn('Paid Events', 'paid_events', 'paid_events'),
        createColumn('Expert Calls', 'expert_calls', 'expert_calls'),
        createColumn('Sarathi Calls', 'sarathi_calls', 'sarathi_calls'),
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) =>
                <Button type="primary" onClick={() => setPlan(record)}>Edit</Button>,
        }
    ]

    return (
        <div className='min-h-screen p-5 w-full overflow-auto flex lg:flex-row flex-col h-max '>
            <div className='flex flex-col gap-2 lg:w-2/3 mr-2'>
                <LazyLoad>
                    {loading ? <Loading /> : <Table
                        dataSource={plans}
                        columns={columns}
                        rowKey={(record) => record._id}
                        pagination={{
                            current: page,
                            pageSize: pageSize,
                            total: totalPlans,
                            onChange: (current, pageSize) => {
                                setPage(current);
                                localStorage.setItem('plansPage', current);
                                setPageSize(pageSize);
                            },
                        }}
                    />}
                </LazyLoad>
            </div>
            <div className='flex lg:mt-0 mt-5 lg:w-1/3 pl-2 lg:border-l-2 dark:lg:border-lightBlack'>
                <UpsertPlanForm plan={plan} setPlan={setPlan} />
            </div>
        </div>
    )
};

export default PlansTab;