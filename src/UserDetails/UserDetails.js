import LazyLoad from '../components/LazyLoad/lazyload';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Raxios from '../services/axiosHelper';
import { message, Table } from 'antd';
import './UserDetails.css';

const UserDetails = () => {
  const { userId } = useParams();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [numberOfCalls, setNumberOfCalls] = useState('');
  const [source, setSource] = useState('');
  const [context, setContext] = useState([]);
  const [persona, setPersona] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const fetchData = async () => {
    try {
      const response = await Raxios.get(`/user/users/${userId}`);
      setName(response.data.name);
      setIsPremium(response.data.isPaidUser);
      setPhoneNumber(response.data.phoneNumber);
      setCity(response.data.city);
      setBirthDate(new Date(response.data.birthDate).toISOString().split('T')[0]);
      setNumberOfCalls(response.data.numberOfCalls);
      setSource(response.data.source);
      setContext(response.data.context);
      setPersona(response.data['Customer Persona']);
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };


  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [userId]);

  useEffect(() => {
    if (window.location.hash === '#notifications-table') {
      const notificationsElement = document.getElementById('notifications-table');
      if (notificationsElement) {
        notificationsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [notifications]);

  const columns = [
    { title: 'Message', dataIndex: 'body', key: 'body', },
    { title: 'Template', dataIndex: 'templateName', key: 'templateName', },
    { title: 'Date', dataIndex: 'createdAt', key: 'createdAt', },
    { title: 'Status', dataIndex: 'status', key: 'status', },
    { title: "Type", dataIndex: "type", key: "type", }
  ];

  const handleUpdate = () => {
    Raxios.put(`/user/users/${userId}`, {
      name,
      phoneNumber,
      city,
      birthDate,
      numberOfCalls,
      source,
      context,
    })
      .then(response => {
        console.log(response);
        window.alert('User details updated successfully.');
        setEditMode(false);
        fetchData();
      })
      .catch(error => {
        console.error('Error updating user details:', error);
        window.alert('Error updating user details:', error);
      });
  };

  const handlePremium = () => {
    try {
      const response = Raxios.put(`/user/users/${userId}`, {
        isPaidUser: !isPremium,
      });
      console.log(response);
      message.success("User Premium Status Changed Successfully.");
      fetchData();
    } catch (error) {
      message.error('Error updating user details:', error);
    }
  };


  const handleDelete = () => {
    Raxios.delete(`/user/users/${userId}`)
      .then(() => {
        window.alert('User deleted successfully.');
        window.location.href = '/admin/users';
      })
      .catch(error => {
        console.error('Error deleting user:', error);
        window.alert('Error deleting user:', error);
      });
  };

  return (
    <LazyLoad>
      <div className='details-container h-screen overflow-auto'>
        <div id='details-container' className='w-full p-10'>
          <div id='details-header' className='flex flex-row items-center justify-between'>
            <h2 className='text-2xl'>User Details</h2>
            <button className='back-button' onClick={() => window.history.back()}>
              <FaArrowLeft className="back-icon" />
            </button>
          </div>
          <div id='details-content' className='grid md:grid-cols-2 md:gap-4'>
            <div className='flex gap-2 w-full'>
              <div className='grid-tile w-full'>
                <h3>Name</h3>
                {editMode ? (
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                ) : (
                  <h2 className='text-2xl'>{name}</h2>
                )}
              </div>
              <div className='grid-tile w-full flex justify-between items-center'>
                <span className='text-2xl'>Premium User</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={isPremium === true}
                    onChange={() => handlePremium()}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
            <div className='grid-tile'>
              <h3>Phone Number</h3>
              {editMode ? (
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              ) : (
                <h2 className='text-2xl'>{phoneNumber}</h2>
              )}
            </div>
            <div className='flex w-full h-full'>
              <div className='grid-tile w-full h-fit'>
                <h3>City</h3>
                {editMode ? (
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                ) : (
                  <h2 className='text-2xl'>{city}</h2>
                )}
              </div>
              <div className='grid-tile w-full h-fit'>
                <h3>Birth Date</h3>
                {editMode ? (
                  <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                ) : (
                  <h2 className='text-2xl'>{birthDate}</h2>
                )}
              </div>
            </div>
            {context && (
              <div className='grid-tile'>
                <h3>Context</h3>
                {editMode ? (
                  <textarea
                    className='h-4/5 w-full' value={context}
                    onChange={(e) => setContext(e.target.value)}
                  />
                ) : (
                  <h2 className='whitespace-pre-wrap'>{context}</h2>
                )}
              </div>
            )}
            <div className='edit-button-container'>
              <div className='grid-tile'>
                <h3>Number of Calls</h3>
                <h2 className='text-2xl'>{numberOfCalls}</h2>
              </div>
              {source && <div className='grid-tile'>
                <h3>Source</h3>
                {editMode ? (
                  <input type="text" value={source} onChange={(e) => setSource(e.target.value)} />
                ) : (
                  <h2 className='text-2xl'>{source}</h2>
                )}
              </div>}
              {editMode && <button className='update-button' onClick={handleUpdate}>Update Details</button>}
              {editMode ? (
                <button className='update-button' onClick={() => setEditMode(false)}>Cancel</button>
              ) : (
                <button className='update-button' onClick={() => setEditMode(true)}>Edit Details</button>
              )}
              <button className='update-button' style={{ backgroundColor: "red" }} onClick={handleDelete}>Delete User</button>
            </div>
          </div>
          <div className='grid md:grid-cols-2 md:gap-4'>
            <div className='grid-tile'>
              <h3>Customer Persona</h3>
              {persona && (
                <h2 className='text-2xl whitespace-pre-wrap'>{persona}</h2>
              )}
            </div>
            <div id="notifications-table" className='grid-tile'>
              <h3>Notifications</h3>
              <Table
                className='overflow-auto'
                columns={columns}
                dataSource={notifications}
                pagination={false}
                rowKey={(record) => record?.messageId || record?.createdAt}
              />
            </div>
          </div>
        </div>
      </div>
    </LazyLoad>
  );
};

export default UserDetails;
