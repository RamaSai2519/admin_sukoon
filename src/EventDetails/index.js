import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { downloadExcel } from '../Utils/exportHelper';
import LazyLoad from '../components/LazyLoad/lazyload';
import { raxiosFetchData } from '../services/fetchData';
import EventUsersTable from '../components/EventUsersTable';
import CreateEventPopup from '../components/Popups/CreateEventPopup';

const EventDetails = () => {
    const { slug } = useParams();
    const [users, setUsers] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [data, setData] = useState({});

    const fetchEventDetails = async () => {
        const response = await raxiosFetchData(null, null, null, null, '/list_events', { slug });
        setData(response.data[0]);
    };

    const fetchUsers = async () => {
        await raxiosFetchData(null, null, setUsers, null, '/list_event_users', { slug });
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
                            {/* <Button onClick={handleExport}>Download Excel</Button> */}
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
