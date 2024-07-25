import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import LazyLoad from '../components/LazyLoad/lazyload';
import Raxios from '../services/axiosHelper';
import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import CreateEventPopup from '../components/Popups/CreateEventPopup';
import { downloadExcel } from '../Utils/exportHelper';
import EventUsersTable from '../components/EventUsersTable';

const EventDetails = () => {
    const { slug } = useParams();
    const [users, setUsers] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [data, setData] = useState({});

    const fetchEventDetails = async () => {
        try {
            const response = await Raxios.get(`/event/handle?slug=${slug}`);
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
        // eslint-disable-next-line
    }, [slug, editMode]);

    const handleExport = async () => {
        downloadExcel(users, 'Event Users.xlsx');
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    return (
        <LazyLoad>
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
                            <Button onClick={handleExport}>Download Excel</Button>
                        </div>
                        <EventUsersTable users={users} />
                    </div> :
                    <CreateEventPopup setVisible={setEditMode} data={data} editMode={editMode} />
                }
            </div>
        </LazyLoad>
    );
}

export default EventDetails;
