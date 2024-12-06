import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import './UserDetails.css';
import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Raxios from '../services/axiosHelper';
import LazyLoad from '../components/LazyLoad/lazyload';
import { raxiosFetchData } from '../services/fetchData';
import { DatePicker, Input, message, Switch, Table } from 'antd';
import PropertyValueRenderer from '../components/JsonRenderer';

const InputField = ({ label, value, onChange, editMode, type = "text" }) => (
  <div className='grid-tile w-full h-fit'>
    <h3>{label}</h3>
    {editMode ? (
      <Input type={type} value={value} onChange={onChange} />
    ) : (
      <h2 className='text-2xl'>{value}</h2>
    )}
  </div>
);

const SwitchField = ({ label, checked, onChange }) => (
  <div className='w-full flex justify-between items-center'>
    <span className='text-2xl'>{label}</span>
    <Switch checked={checked} onChange={onChange} />
  </div>
);

const UserDetails = () => {
  const { userId } = useParams();
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [persona, setPersona] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [numberOfCalls, setNumberOfCalls] = useState('');
  const [notifications, setNotifications] = useState([]);

  const fetchData = async () => {
    const phoneNumber = localStorage.getItem('userNumber');
    let payload = {};
    if (userId) {
      payload = { user_id: userId };
    } else {
      payload = { phoneNumber };
    }
    try {
      const data = await raxiosFetchData(null, null, null, null, '/actions/user', payload, null);
      setName(data.name);
      setCity(data.city);
      setIsBusy(data.isBusy);
      setIsPaidUser(data.isPaidUser);
      setPhoneNumber(data.phoneNumber);
      setPersona(data.customerPersona);
      setBirthDate(dayjs(data.birthDate));
      setNumberOfCalls(data.numberOfCalls);
      setNotifications(data.notifications);
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

  const handleUpdate = async (updatedFields) => {
    // eslint-disable-next-line
    const { phoneNumber, numberOfCalls } = updatedFields;
    if (numberOfCalls > 3) {
      message.error('Number of calls cannot be greater than 3.');
      return;
    }
    try {
      const response = await Raxios.post(`/actions/user`, {
        ...updatedFields,
        ...numberOfCalls && { numberOfCalls: parseInt(numberOfCalls) },
      });
      if (response.status !== 200) {
        message.error(response.msg);
      } else {
        message.success(response.msg);
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleSwitchChange = (field, value) => {
    const updatedFields = { phoneNumber, [field]: value };
    if (field === 'isPaidUser') {
      setIsPaidUser(value);
    } else if (field === 'isBusy') {
      setIsBusy(value);
    }
    handleUpdate(updatedFields);
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
              <InputField label="Name" value={name} onChange={(e) => setName(e.target.value)} editMode={editMode} />
              <div className='grid-tile w-full flex flex-col justify-between items-center'>
                <SwitchField label="Premium User" checked={isPaidUser} onChange={(checked) => handleSwitchChange('isPaidUser', checked)} />
                <SwitchField label="Busy" checked={isBusy} onChange={(checked) => handleSwitchChange('isBusy', checked)} />
              </div>
            </div>
            <InputField label="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} editMode={editMode} />
            <div className='flex w-full h-full'>
              <InputField label="City" value={city} onChange={(e) => setCity(e.target.value)} editMode={editMode} />
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
              <InputField label="Number of Calls" value={numberOfCalls} onChange={(e) => setNumberOfCalls(e.target.value)} editMode={editMode} type="number" />
              {editMode && <button className='update-button' onClick={() => handleUpdate({ phoneNumber, name, city, isBusy, isPaidUser, birthDate, numberOfCalls })}>Update Details</button>}
              {editMode ? (
                <button className='update-button' onClick={() => setEditMode(false)}>Cancel</button>
              ) : (
                <button className='update-button' onClick={() => setEditMode(true)}>Edit Details</button>
              )}
            </div>
          </div>
          <div className='grid md:grid-cols-2 md:gap-4'>
            <div className='grid-tile h-fit'>
              <h3>Customer Persona</h3>
              {persona && <PropertyValueRenderer data={persona} />}
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
