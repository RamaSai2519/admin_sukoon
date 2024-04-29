import { useState, useEffect } from 'react';
import axios from 'axios';

const useCallsData = () => {
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await axios.get('/api/calls');
        setCalls(response.data.reverse());
        localStorage.setItem('calls', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching all calls:', error);
      }
    };

    const cachedCalls = JSON.parse(localStorage.getItem('calls'));
    console.log(cachedCalls);
    if (cachedCalls != null) {
      setCalls(cachedCalls);
      fetchNewCalls(cachedCalls);
    } else {
      fetchCalls();
    }
  }, []);

  const fetchNewCalls = async (cachedCalls) => {
    const latestTimestamp = cachedCalls.length > 0 ? cachedCalls[0].initiatedTime : 0;
    try {
      const response = await axios.get(`/api/new-calls?timestamp=${latestTimestamp}`);
      const newData = response.data;
      const filteredNewData = newData.filter(newCall => !cachedCalls.some(cachedCall => cachedCall.initiatedTime === newCall.initiatedTime));
      if (filteredNewData.length > 0) {
        const mergedData = [...cachedCalls, ...filteredNewData];
        mergedData.sort((a, b) => b.initiatedTime - a.initiatedTime);
        setCalls(mergedData);
        localStorage.setItem('calls', JSON.stringify(mergedData));
      }
    } catch (error) {
      console.error('Error fetching new calls:', error);
    }
  };



  return { calls };
};

export default useCallsData;
