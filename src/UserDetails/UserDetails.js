import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Raxios from '../services/axiosHelper';
import './UserDetails.css';
import NavMenu from '../components/NavMenu/NavMenu';
import LazyLoad from '../components/LazyLoad/lazyload';

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [numberOfCalls, setNumberOfCalls] = useState('');
  const [source, setSource] = useState('');
  const [context, setContext] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Raxios.get(`/user/users/${userId}`);
        setUser(response.data);
        setName(response.data.name);
        setPhoneNumber(response.data.phoneNumber);
        setCity(response.data.city);
        setBirthDate(new Date(response.data.birthDate).toISOString().split('T')[0]);
        setNumberOfCalls(response.data.numberOfCalls);
        setSource(response.data.source);
        setContext(response.data.context);
      } catch (error) {
        console.error('Error fetching user details:', error);
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
        setUser(response.data);
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
      <div className='details-container h-screen'>
        <div id='details-container' className='w-full p-10'>
          <div id='details-header' className='flex flex-row items-center justify-between'>
            <h1>User Details</h1>
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
                <h1>{name}</h1>
              )}
            </div>
            <div className='grid-tile'>
              <h3>Phone Number</h3>
              {editMode ? (
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              ) : (
                <h1>{phoneNumber}</h1>
              )}
            </div>
            <div className='grid-tile'>
              <h3>City</h3>
              {editMode ? (
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
              ) : (
                <h1>{city}</h1>
              )}
            </div>
            <div className='grid-tile'>
              <h3>Birth Date</h3>
              {editMode ? (
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
              ) : (
                <h1>{birthDate}</h1>
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
                    <h1 key={index}>{item}</h1>
                  ))
                )}
              </div>
            )}
            <div className='edit-button-container'>
              <div className='grid-tile'>
                <h3>Number of Calls</h3>
                <h1>{numberOfCalls}</h1>
              </div>
              <div className='grid-tile'>
                <h3>Source</h3>
                {editMode ? (
                  <input type="text" value={source} onChange={(e) => setSource(e.target.value)} />
                ) : (
                  <h1>{source}</h1>
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
        </div>
        <NavMenu />
      </div>
    </LazyLoad>
  );
};

export default UserDetails;
