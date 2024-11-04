import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, message } from 'antd';
import EditableCell from '../../EditableCell';
import { RaxiosPost } from '../../../services/fetchData';
import { formatDate } from '../../../Utils/formatHelper';
import GetColumnSearchProps from '../../../Utils/antTableHelper';

const LeadsPopup = ({ onClose, leads }) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [data, setData] = useState(leads);
    const searchInputRef = useRef(null);

    const createColumn = (title, dataIndex, key, render, editable) => {
        return {
            title,
            dataIndex,
            key,
            ...GetColumnSearchProps(dataIndex, title, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef),
            ...(editable && { editable }),
            ...(render && { render }),
        };
    };

    const columns = [
        createColumn('Name', 'name', 'name'),
        createColumn('Contact', 'phoneNumber', 'phoneNumber'),
        createColumn('City', 'city', 'city'),
        createColumn('Date of Birth', 'birthDate', 'birthDate', (birthDate) => formatDate(birthDate)),
        createColumn('Date of Lead', 'createdDate', 'createdDate', (createdDate) => formatDate(createdDate)),
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
        const response = await RaxiosPost('/remarks', { key, value });
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

    return (
        <div className="fixed left-0 top-0 overflow-auto w-full h-full bg-black bg-opacity-50 ">
            <div className="p-10 rounded-5 rounded-10 shadow-md min-w-1/2 max-w-90 max-h-90 overflow-y-auto relative">
                <div className='w-fit mx-auto h-auto'>
                    <div className="flex flex-row m-5 justify-end">
                        <button className="pback-button" onClick={onClose}>X</button>
                    </div>
                    {data.length > 0 ? (
                        <Table
                            components={components}
                            dataSource={data}
                            columns={mergedColumns}
                            rowKey={(user) => user._id}
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
