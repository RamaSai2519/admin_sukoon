import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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
      })
      .catch(error => {
        console.error('Error updating user details:', error);
      });
  };

  return (
    <div>
      {user && (
        <div>
          <h2>User Details</h2>
          <p>Name: <input type="text" value={name} onChange={(e) => setName(e.target.value)} /></p>
          <p>Phone Number: <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /></p>
          <p>City: <input type="text" value={city} onChange={(e) => setCity(e.target.value)} /></p>
          <p>Birth Date: <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} /></p>
          <p>Number of Calls: <input type="number" value={numberOfCalls} onChange={(e) => setNumberOfCalls(e.target.value)} /></p>
          <button onClick={handleUpdate}>Update Details</button>
        </div>
      )}
    </div>
  );
};

export default UserDetails;