import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Raxios from '../services/axiosHelper';
import './UserDetails.css';
import LazyLoad from '../components/LazyLoad/lazyload';

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
  const [editMode, setEditMode] = useState(false);

  const fetchData = async () => {
    try {
      const response = await Raxios.get(`/user/users/${userId}`);
      setName(response.data.name);
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
    };

    fetchData();
  }, [userId]);

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
        window.alert('User details updated successfully.');
        setEditMode(false);
      })
      .catch(error => {
        console.error('Error updating user details:', error);
        window.alert('Error updating user details:', error);
      });
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

  const handleContextChange = (e) => {
    const sentences = e.target.value.split('\n');
    setContext(sentences);
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
            <div className='grid-tile'>
              <h3>Name</h3>
              {editMode ? (
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              ) : (
                <h2 className='text-2xl'>{name}</h2>
              )}
            </div>
            <div className='grid-tile'>
              <h3>Phone Number</h3>
              {editMode ? (
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              ) : (
                <h2 className='text-2xl'>{phoneNumber}</h2>
              )}
            </div>
            <div className='grid-tile'>
              <h3>City</h3>
              {editMode ? (
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
              ) : (
                <h2 className='text-2xl'>{city}</h2>
              )}
            </div>
            <div className='grid-tile'>
              <h3>Birth Date</h3>
              {editMode ? (
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
              ) : (
                <h2 className='text-2xl'>{birthDate}</h2>
              )}
            </div>
            {context && context.length > 0 && (
              <div className='grid-tile'>
                <h3>Context</h3>
                {editMode ? (
                  <textarea
                    className='h-4/5 w-full'
                    value={context.join('\n')}
                    rows={context.length}
                    onChange={handleContextChange}
                  />
                ) : (
                  context.map((item, index) => (
                    <h2 key={index}>{item}</h2>
                  ))
                )}
              </div>
            )}
            <div className='edit-button-container'>
              <div className='grid-tile'>
                <h3>Number of Calls</h3>
                <h2 className='text-2xl'>{numberOfCalls}</h2>
              </div>
              <div className='grid-tile'>
                <h3>Source</h3>
                {editMode ? (
                  <input type="text" value={source} onChange={(e) => setSource(e.target.value)} />
                ) : (
                  <h2 className='text-2xl'>{source}</h2>
                )}
              </div>
              {editMode && <button className='update-button' onClick={handleUpdate}>Update Details</button>}
              {editMode ? (
                <button className='update-button' onClick={() => setEditMode(false)}>Cancel</button>
              ) : (
                <button className='update-button' onClick={() => setEditMode(true)}>Edit Details</button>
              )}
              <button className='update-button' style={{ backgroundColor: "red" }} onClick={handleDelete}>Delete User</button>
            </div>
          </div>
          <div className='grid-tile'>
            <h3>Customer Persona</h3>
            {persona && (
              // persona.map((item, index) => (
              //   <h2 className='text-2xl' key={index}>{item}</h2>
              // ))
              <h2 className='text-2xl whitespace-pre-wrap'>{persona}</h2>
            )}
          </div>
        </div>
      </div>
    </LazyLoad>
  );
};

export default UserDetails;
