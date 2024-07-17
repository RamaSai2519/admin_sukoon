import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, ConfigProvider, theme, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import EditableCell from '../../EditableCell';
import Raxios from '../../../services/axiosHelper';
import { formatDate } from '../../../Utils/formatHelper';
import getColumnSearchProps from '../../../Utils/antTableHelper';

const LeadsPopup = ({ onClose, leads }) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [data, setData] = useState(leads);
    const searchInputRef = useRef(null);
    const darkMode = localStorage.getItem('darkMode') === 'true';

    const createColumn = (title, dataIndex, key, render, editable) => {
        return {
            title,
            dataIndex,
            key,
            ...getColumnSearchProps(dataIndex, title, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef),
            ...(editable && { editable }),
            ...(render && { render }),
        };
    };

    const columns = [
        createColumn('Name', 'name', 'name'),
        createColumn('Contact', 'phoneNumber', 'phoneNumber'),
        createColumn('City', 'city', 'city'),
        createColumn('Date of Lead', 'createdDate', 'createdDate', (createdDate) => formatDate(createdDate)),
        createColumn('Lead Source', 'leadSource', 'leadSource'),
        createColumn('Source', 'source', 'source'),
        createColumn('Remarks', 'remarks', 'remarks', null, true),
        {
            title: 'Actions', key: 'actions',
            render: (user) => {
                return (
                    <div className='flex gap-2'>
                        <Link to={`/admin/users/${user._id}`}>
                            <Button className='w-full'>
                                Edit
                            </Button>
                        </Link>
                        <Popconfirm
                            title="Delete the record"
                            description="Are you sure to delete this record?"
                            onConfirm={() => confirm(user)} onCancel={cancel}
                            okText="Yes" cancelText="No"
                            icon={
                                <QuestionCircleOutlined style={{ color: 'red' }} />
                            }
                        >
                            <Button>Delete</Button>
                        </Popconfirm>
                    </div>
                );
            }
        },
    ];

    const handleSave = async ({ key, field, value }) => {
        try {
            await Raxios.post('/user/leadRemarks', { key, field, value })
                .then((response) => {
                    if (response.request.status === 200) {
                        let updatedLeads = [...data];
                        const index = updatedLeads.findIndex((item) => key === item._id);
                        updatedLeads[index][field] = value;
                        setData(updatedLeads);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    window.alert('Error updating data');
                });
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const confirm = (user) => {
        Raxios.post(`/user/leads`, { user })
            .then((response) => {
                if (response.request.status === 200) {
                    window.alert('Lead deleted successfully');
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const cancel = (e) => {
        console.log(e);
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
                        <ConfigProvider theme={{
                            algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                        }}>
                            <Table
                                components={components}
                                dataSource={data}
                                columns={mergedColumns}
                                rowKey={(user) => user._id}
                            />
                        </ConfigProvider>
                    ) : (
                        <p>No users to display</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeadsPopup;
