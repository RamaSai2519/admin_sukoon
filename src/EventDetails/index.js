import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useFilters } from '../contexts/useData';
import { Button, message, Popconfirm } from 'antd';
import LazyLoad from '../components/LazyLoad/lazyload';
import { raxiosFetchData, RaxiosPost } from '../services/fetchData';
import { useLocation, useParams } from 'react-router-dom';
import EventUsersTable from '../components/EventUsersTable';
import CreateEventPopup from '../components/Popups/CreateEventPopup';

const EventDetails = () => {
    const location = useLocation();
    const { filters = {} } = useFilters();
    const filter = filters[location.pathname] || {};

    const { slug } = useParams();
    const [data, setData] = useState({});
    const [users, setUsers] = useState([]);
    const [editMode, setEditMode] = useState(false);

    const fetchEventDetails = async () => {
        const response = await raxiosFetchData(null, null, null, null, '/actions/list_events', { slug });
        setData(response.data[0]);
    };

    const fetchUsers = async () => {
        await raxiosFetchData(null, null, setUsers, null, '/actions/list_event_users', { slug, ...filter });
    };

    useEffect(() => {
        fetchEventDetails();
        fetchUsers();
        // eslint-disable-next-line
    }, [slug, editMode, JSON.stringify(filter)]);

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    const DeleteEvent = async () => {
        const response = await RaxiosPost('/actions/upsert_event', { slug, isDeleted: true });
        if (response.status === 200) {
            message.success(response.msg);
            window.history.back();
        } else {
            message.error(response.msg);
        }
    }

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
                        <div className='flex justify-center items-center w-full gap-2'>
                            <Button className='w-fit' onClick={toggleEditMode}>{editMode ? 'Cancel' : 'Edit Event Details'}</Button>
                            <Popconfirm
                                title="Are you sure you want to delete this event?"
                                onConfirm={DeleteEvent}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button className='w-fit' danger>Delete Event</Button>
                            </Popconfirm>
                        </div>
                    </div>
                </div>
                {!editMode ?
                    <div className='w-full'>
                        <div className='flex justify-between'>
                            <h1>Registered Users</h1>
                            {/* <Button onClick={handleExport}>Download Excel</Button> */}
                        </div>
                        <EventUsersTable users={users} pathname={location.pathname} />
                    </div> :
                    <CreateEventPopup setVisible={setEditMode} data={data} editMode={editMode} />
                }
            </div>
        </LazyLoad>
    );
}

export default EventDetails;
