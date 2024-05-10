import React, { useState, useEffect, useContext } from 'react';
import Raxios from './axiosHelper';

const DataContext = React.createContext();

export const useData = () => {
  return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
  const [errorLogs, setErrorLogs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [allCategories, setCategories] = useState([]);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [calls, setCalls] = useState([]);
  const [experts, setExperts] = useState([]);
  const [stats, setStats] = useState({
    totalCalls: "Please Wait...",
    successfulCalls: "Please Wait...",
    todayCalls: 0,
    todaySuccessfulCalls: 0,
    averageCallDuration: "Please Wait...",
    onlineSaarthis: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          errorLogsResponse,
          applicationsResponse,
          categoriesResponse,
          statsResponse,
          leadsResponse,
          usersResponse,
          callsResponse,
          expertsResponse
        ] = await Promise.all([
          Raxios.get('/api/errorlogs'),
          Raxios.get('/api/applications'),
          Raxios.get('/api/categories'),
          Raxios.get('/api/dashboard/stats'),
          Raxios.get('/api/leads'),
          Raxios.get('/api/users'),
          Raxios.get('/api/calls'),
          Raxios.get('/api/experts')
        ]);

        setErrorLogs(errorLogsResponse.data.reverse());
        setApplications(applicationsResponse.data.reverse());
        setCategories(categoriesResponse.data);
        setStats(statsResponse.data);
        setLeads(leadsResponse.data);
        setUsers(usersResponse.data);
        setCalls(callsResponse.data.reverse());
        setExperts(expertsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const data = {
    errorLogs,
    applications,
    allCategories,
    stats,
    leads,
    users,
    calls,
    experts
  };

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
};
