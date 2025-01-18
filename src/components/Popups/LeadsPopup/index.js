import React, { useState, useRef, useEffect } from 'react';
import Loading from '../../Loading/loading';
import { Table, Button, message } from 'antd';
import EditableCell from '../../EditableCell';
import { Link, useLocation } from 'react-router-dom';
import { useFilters } from '../../../contexts/useData';
import { formatDate } from '../../../Utils/formatHelper';
import GetColumnSearchProps from '../../../Utils/antTableHelper';
import { raxiosFetchData, RaxiosPost } from '../../../services/fetchData';

const LeadsPopup = ({ onClose }) => {
    const location = useLocation();
    const { filters = {} } = useFilters();
    const filter = filters[location.pathname] || {};

    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(
        localStorage.getItem('leadsPage') ? parseInt(localStorage.getItem('leadsPage')) : 1
    );
    const [pageSize, setPageSize] = useState(9);
    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInputRef = useRef(null);


    const fetchData = async () => {
        await raxiosFetchData(page, pageSize, setData, setTotal, '/actions/leads', filter, setLoading);
    };

    // eslint-disable-next-line
    useEffect(() => { fetchData() }, [page, pageSize, JSON.stringify(filter)]);

    const createColumn = (title, dataIndex, key, render, sorter, filter = true) => ({
        title, dataIndex, key, ...(sorter && { sorter }), ...(render && { render }),
        ...GetColumnSearchProps(dataIndex, title, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef, location.pathname, filter),
    });

    const columns = [
        createColumn('Name', 'name', 'name'),
        createColumn('Contact', 'phoneNumber', 'phoneNumber'),
        createColumn('City', 'city', 'city'),
        { title: 'DOB', dataIndex: 'birthDate', key: 'birthDate', render: (date) => formatDate(date), sorter: (a, b) => new Date(a.birthDate) - new Date(b.birthDate) },
        { title: 'Joined Date', dataIndex: 'createdDate', key: 'createdDate', render: (date) => formatDate(date), sorter: (a, b) => new Date(a.createdDate) - new Date(b.createdDate) },
        createColumn('Lead Source', 'leadSource', 'leadSource'),
        createColumn('Source', 'source', 'source'),
        createColumn('Remarks', 'remarks', 'remarks', null, true),
        {
            title: 'Actions', key: 'actions',
            render: (user) => <Link to={`/admin/users/${user._id}`}>
                <Button className='w-full' onClick={() => localStorage.setItem('userNumber', user.phoneNumber)}>
                    Edit
                </Button>
            </Link>
        }
    ];

    const handleSave = async ({ key, field, value }) => {
        const response = await RaxiosPost('/actions/remarks', { key, value });
        if (response.status !== 200) {
            message.error(response.msg);
        } else {
            let updatedLeads = [...data];
            const index = updatedLeads.findIndex((item) => key === item._id);
            updatedLeads[index][field] = value;
            setData(updatedLeads);
        }

    };

    const components = {
        body: {
            cell: EditableCell,
        },
    };

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    if (loading) { return <Loading /> }

    return (
        <div className="fixed left-0 top-0 overflow-auto w-full h-full bg-black bg-opacity-50 ">
            <div className="p-10 rounded-5 rounded-10 shadow-md min-w-1/2 max-w-90 max-h-90 overflow-y-auto relative">
                <div className='w-fit mx-auto h-auto'>
                    {data.length > 0 ? (
                        <Table
                            components={components}
                            dataSource={data}
                            columns={mergedColumns}
                            rowKey={(user) => user._id}
                            pagination={{
                                total: total,
                                current: page,
                                pageSize: pageSize,
                                onChange: (current, pageSize) => {
                                    setPage(current);
                                    localStorage.setItem('leadsPage', current);
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

export default LeadsPopup;
