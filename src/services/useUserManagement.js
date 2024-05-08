import { useState, useEffect } from 'react';
import axios from 'axios';

const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);

  function findLatestTimestamp(experts) {
    let latestTimestamp = 0;
    for (const expert of experts) {
      const timestamp = Date.parse(expert.createdDate);
      if (timestamp > latestTimestamp) {
        latestTimestamp = timestamp;
      }
    }
    const latestDate = new Date(latestTimestamp);
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'GMT' };
    const formattedDate = latestDate.toLocaleString('en-US', options);
    return formattedDate;
  }

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data);
        localStorage.setItem('users', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching all users:', error);
      }
    };

    const cachedUsers = JSON.parse(localStorage.getItem('users'));
    if (cachedUsers) {
      setUsers(cachedUsers);
      fetchNewUsers(cachedUsers);
      fetchAllLeads();
    } else {
      fetchAllUsers();
    }
  }, []);

  const fetchNewUsers = async (cachedUsers) => {
    const latestTimestamp = findLatestTimestamp(cachedUsers);
    try {
      const response = await axios.get(`/api/new-users?timestamp=${latestTimestamp}`);
      const newData = response.data;
      const filteredNewData = newData.filter(newUser => !cachedUsers.some(cachedUser => cachedUser.id === newUser.id));
      if (filteredNewData.length > 0) {
        const mergedData = [...cachedUsers, ...filteredNewData];
        mergedData.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        setUsers(mergedData.reverse());
        localStorage.setItem('users', JSON.stringify(mergedData));
      }
    } catch (error) {
      console.error('Error fetching new users:', error);
    }
  };

  const fetchAllLeads = async () => {
    try {
      const response = await axios.get('/api/leads');
      setLeads(response.data);
      localStorage.setItem('leads', JSON.stringify(response.data));
    }
    catch (error) {
      console.error('Error fetching all leads:', error);
    }
  };


  return { users, leads };
};

export default useUserManagement;
