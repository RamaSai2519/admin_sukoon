import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  const [editMode, setEditMode] = useState(false);

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
        window.alert('User details updated successfuly.');
        setEditMode(false);
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
            {editMode ? (
              <p><input type="text" value={name} onChange={(e) => setName(e.target.value)} /></p>
            ) : (
              <h2>{name}</h2>
            )}
          </div>
          <div className='grid-tile-1'>
            <h3>Phone Number</h3>
            {editMode ? (
              <p><input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /></p>
            ) : (
              <h2>{phoneNumber}</h2>
            )}
          </div>
          <div className='grid-tile-1'>
            <h3>City</h3>
            {editMode ? (
              <p><input type="text" value={city} onChange={(e) => setCity(e.target.value)} /></p>
            ) : (
              <h2>{city}</h2>
            )}
          </div>
          <div className='grid-tile-1'>
            <h3>Birth Date</h3>
            {editMode ? (
              <p><input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} /></p>
            ) : (
              <h2>{birthDate}</h2>
            )}
          </div>
          <div className='grid-tile-1'>
            <h3>Number of Calls</h3>
            {editMode ? (
              <p><input type="number" value={numberOfCalls} onChange={(e) => setNumberOfCalls(e.target.value)} /></p>
            ) : (
              <h2>{numberOfCalls}</h2>
            )}
          </div>
          <div className='edit-button-container'>
            {editMode ? (
              <button className='update-button' onClick={() => setEditMode(false)}>Cancel</button>
            ) : (
              <button className='update-button' onClick={() => setEditMode(true)}>Edit Details</button>
            )}
            {editMode && <button className='update-button' onClick={handleUpdate}>Update Details</button>}
          </div>
        </div>
      )}
      <Link to="/experts" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 className="experts-button">View All Experts</h1>
      </Link>
      <Link to="/calls" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 className="calls-button">View All Calls</h1>
      </Link>
      <Link to="/users" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 className="users-button">View All Users</h1>
      </Link>
    </div>
  );
};

export default UserDetails;