import { Table, Button, ConfigProvider, Upload, message, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import LazyLoad from '../components/LazyLoad/lazyload';
import writeXlsxFile from 'write-excel-file';
import Raxios from '../services/axiosHelper';
import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import CreateEventPopup from '../components/Popups/CreateEventPopup';

const EventDetails = () => {
    const { slug } = useParams();
    const [users, setUsers] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [data, setData] = useState({});
    const darkMode = localStorage.getItem('darkMode') === 'true';

    const fetchEventDetails = async () => {
        try {
            const response = await Raxios.get(`/event/event?slug=${slug}`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching event details:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await Raxios.get(`/event/users?slug=${slug}`);
            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                console.error('Error: Users data is not an array:', response.data);
                setUsers([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchEventDetails();
        fetchUsers();
    }, [slug]);

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Contact', dataIndex: 'phoneNumber', key: 'phoneNumber' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'City', dataIndex: 'city', key: 'city' },
        { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', render: (time) => new Date(time).toLocaleString() },
        { title: 'Updated At', dataIndex: 'updatedAt', key: 'updatedAt', render: (time) => new Date(time).toLocaleString() }
    ];

    const downloadExcel = async () => {
        const wsData = [
            [
                { value: 'Name' },
                { value: 'Contact' },
                { value: 'Email' },
                { value: 'City' },
                { value: 'Created At' },
                { value: 'Updated At' }
            ]
        ];
        users.forEach(user => {
            wsData.push([
                { value: user.name },
                { value: user.phoneNumber },
                { value: user.email },
                { value: user.city },
                { value: new Date(user.createdAt).toLocaleString() },
                { value: new Date(user.updatedAt).toLocaleString() }
            ]);
        });
        const buffer = await writeXlsxFile(wsData, {
            headerStyle: {
                fontWeight: 'bold'
            },
            buffer: true
        });
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'UserList.xlsx');
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
        console.log('Edit mode:', editMode);
    };

    return (
        <LazyLoad>
            <ConfigProvider theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
                <div className="flex flex-col px-5 min-h-screen max-w-screen-2xl mx-auto">
                    <div id='details-header' className='flex flex-row items-center justify-between'>
                        <h1>Event Details</h1>
                        <button className='back-button' onClick={() => window.history.back()}>
                            <FaArrowLeft className="back-icon" />
                        </button>
                    </div>
                    <div className='flex w-full items-center justify-stretch '>
                        <div id='details-content' className='flex flex-col items-center'>
                            <div className='grid-tile text-lg w-full'>
                                <h3>Main Title:</h3>
                                <h2 className='text-xl'>{data?.mainTitle}</h2>
                                <br />
                                <h3>Sub Title:</h3>
                                <h2 className='text-xl'>{data?.subTitle}</h2>
                                <br />
                                <h3>Name:</h3>
                                <h2 className='text-xl'>{data?.name}</h2>
                            </div>
                            <div className='w-full'>
                                <Button className='w-fit' onClick={toggleEditMode}>{editMode ? 'Cancel' : 'Edit Event Details'}</Button>
                            </div>
                        </div>
                    </div>
                    {!editMode ?
                        <div className='w-full'>
                            <div className='flex justify-between'>
                                <h1>Registered Users</h1>
                                <Button onClick={downloadExcel}>Download Excel</Button>
                            </div>
                            <Table dataSource={users} columns={columns} rowKey={(record) => record._id || record.email} />
                        </div> :
                        <CreateEventPopup setVisible={setEditMode} data={data} />
                    }
                </div>
            </ConfigProvider>
        </LazyLoad>
    );
}

export default EventDetails;
