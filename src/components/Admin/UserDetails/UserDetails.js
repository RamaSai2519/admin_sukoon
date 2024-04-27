import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './UserDetails.css';

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [numberOfCalls, setNumberOfCalls] = useState('');

  useEffect(() => {
    axios.get(`/api/users/${userId}`)
      .then(response => {
        setUser(response.data);
        setName(response.data.name);
        setPhoneNumber(response.data.phoneNumber);
        setCity(response.data.city);
        setBirthDate(new Date(response.data.birthDate).toISOString().split('T')[0]);
        setNumberOfCalls(response.data.numberOfCalls);
      })
      .catch(error => {
        console.error('Error fetching user details:', error);
      });
  }, [userId]);

  const handleUpdate = () => {
    axios.put(`/api/users/${userId}`, {
      name,
      phoneNumber,
      city,
      birthDate,
      numberOfCalls
    })
      .then(response => {
        setUser(response.data);
        console.log('User details updated successfully.');
        window.alert('User details updated successfully.');
      })
      .catch(error => {
        console.error('Error updating user details:', error);
        window.alert('Error updating user details.:', error);
      });
  };

  return (
    <div className='details-container'>
      {user && (
        <div className='content-container'>
          <h1>User Details</h1>
          <div className='grid-tile-1'>
            <h3>Name</h3>
            <p><input type="text" value={name} onChange={(e) => setName(e.target.value)} /></p>
          </div>
          <div className='grid-tile-1'>
            <h3>Phone Number</h3>
            <p><input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /></p>
          </div>
          <div className='grid-tile-1'>
            <h3>City</h3>
            <p><input type="text" value={city} onChange={(e) => setCity(e.target.value)} /></p>
          </div>
          <div className='grid-tile-1'>
            <h3>Birth Date</h3>
            <p><input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} /></p>
          </div>
          <div className='grid-tile-1'>
            <h3>Number of Calls</h3>
            <p><input type="number" value={numberOfCalls} onChange={(e) => setNumberOfCalls(e.target.value)} /></p>
          </div>
            <button className='update-button' onClick={handleUpdate}>Update Details</button>
          </div>
      )}
    </div>
  );
};

export default UserDetails;