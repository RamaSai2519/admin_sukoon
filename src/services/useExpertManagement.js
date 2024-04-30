import { useState, useEffect } from 'react';
import axios from 'axios';

const useExpertManagement = () => {
  const [experts, setExperts] = useState([]);

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
    const fetchAllExperts = async () => {
      try {
        const response = await axios.get('http://15.206.127.248/api/experts');
        setExperts(response.data);
        localStorage.setItem('experts', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching all experts:', error);
      }
    };

    const cachedExperts = JSON.parse(localStorage.getItem('experts'));
    if (cachedExperts) {
      fetchNewExperts(cachedExperts);
      setExperts(cachedExperts);
    } else {
      fetchAllExperts();
    }
  }, []);

  const fetchNewExperts = async (cachedExperts) => {
    const latestTimestamp = findLatestTimestamp(cachedExperts);
    try {
      const response = await axios.get(`http://15.206.127.248/api/new-experts?timestamp=${latestTimestamp}`);
      const newExperts = response.data;
      const filteredNewExperts = newExperts.filter(newExpert => !cachedExperts.some(cachedExpert => cachedExpert.id === newExpert.id));
      if (newExperts.length > 0) {
        const mergedData = [...filteredNewExperts, ...cachedExperts ];
        mergedData.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        setExperts(mergedData);
        localStorage.setItem('experts', JSON.stringify(mergedData));
      }
    } catch (error) {
      console.error('Error fetching new experts:', error);
    }
  };

  return { experts, fetchNewExperts };
};

export default useExpertManagement;