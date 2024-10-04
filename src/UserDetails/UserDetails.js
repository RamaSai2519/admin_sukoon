import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Raxios from '../services/axiosHelper';
import Faxios from '../services/raxiosHelper';
import LazyLoad from '../components/LazyLoad/lazyload';
import { DatePicker, Input, message, Switch, Table } from 'antd';
import './UserDetails.css';
import { raxiosFetchData } from '../services/fetchData';

const UserDetails = () => {
  const { userId } = useParams();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [persona, setPersona] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [numberOfCalls, setNumberOfCalls] = useState('');
  const [notifications, setNotifications] = useState([]);

  const fetchData = async () => {
    const phoneNumber = localStorage.getItem('userNumber');
    try {
      const data = raxiosFetchData(null, null, null, null, '/user', phoneNumber, setLoading);
      setName(response.data.name);
      setCity(response.data.city);
      setIsPremium(response.data.isPaidUser);
      setPhoneNumber(response.data.phoneNumber);
      setNumberOfCalls(response.data.numberOfCalls);
      setNotifications(response.data.notifications);
      setBirthDate(dayjs(response.data.birthDate));

      if (typeof response.data['Customer Persona'] === 'object') {
        const personaString = JSON.stringify(response.data['Customer Persona'], null, 2);
        // eslint-disable-next-line
        const personaWithoutQuotes = personaString.replace(/\"/g, '');
        setPersona(personaWithoutQuotes);
      } else {
        setPersona(response.data['Customer Persona']);
      }
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

  const handleUpdate = async () => {
    if (numberOfCalls > 3) {
      message.error('Number of calls cannot be greater than 3.');
      return;
    }
    try {
      const response = await Faxios.post(`/user`, {
        name,
        city,
        ...(birthDate !== '' && { birthDate }),
        phoneNumber,
        numberOfCalls: parseInt(numberOfCalls),
      })
      if (response.status !== 200) {
        message.error(response.msg);
      } else {
        message.success(response.msg);
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const handlePremium = async () => {
    try {
      await Raxios.put(`/user/users/${userId}`, { isPaidUser: !isPremium });
      fetchData();
      message.success("User Premium Status Changed Successfully.");
    } catch (error) {
      message.error('Error updating user details:', error);
    }
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
                <Switch
                  checked={isPremium}
                  onChange={handlePremium}
                />
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
                  <DatePicker
                    value={birthDate}
                    onChange={(date) => setBirthDate(date ? dayjs(date) : '')}
                  />
                ) : (
                  <h2 className='text-2xl'>{birthDate ? birthDate.format('DD MMM YYYY') : ''}</h2>
                )}
              </div>
            </div>
            <div className='edit-button-container'>
              <div className='grid-tile'>
                <h3>Number of Calls</h3>
                {editMode ?
                  <Input
                    type="number"
                    value={numberOfCalls}
                    onChange={(e) => setNumberOfCalls(e.target.value)}
                  />
                  : <h2 className='text-2xl'>{numberOfCalls}</h2>}
              </div>
              {editMode && <button className='update-button' onClick={handleUpdate}>Update Details</button>}
              {editMode ? (
                <button className='update-button' onClick={() => setEditMode(false)}>Cancel</button>
              ) : (
                <button className='update-button' onClick={() => setEditMode(true)}>Edit Details</button>
              )}
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
