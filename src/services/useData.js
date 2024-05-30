import React, { useState, useContext } from 'react';
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
  const [schedules, setSchedules] = useState([]);
  const [stats, setStats] = useState({
    totalCalls: "Please Wait...",
    successfulCalls: "Please Wait...",
    todayCalls: 0,
    todaySuccessfulCalls: 0,
    averageCallDuration: "Please Wait...",
    failedCalls: "Please Wait...",
    todayFailedCalls: 0,
    onlineSaarthis: []
  });

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
        expertsResponse,
        schedulesResponse
      ] = await Promise.all([
        Raxios.get('/data/errorlogs'),
        Raxios.get('/data/applications'),
        Raxios.get('/data/categories'),
        Raxios.get('/service/dashboardstats'),
        Raxios.get('/user/leads'),
        Raxios.get('/data/users'),
        Raxios.get('/data/calls'),
        Raxios.get('/data/experts'),
        Raxios.get('/data/schedules')
      ]);

      setErrorLogs(errorLogsResponse.data.reverse());
      setApplications(applicationsResponse.data.reverse());
      setCategories(categoriesResponse.data);
      setStats(statsResponse.data);
      setLeads(leadsResponse.data);
      setUsers(usersResponse.data);
      setCalls(callsResponse.data.reverse());
      setExperts(expertsResponse.data);
      setSchedules(schedulesResponse.data.map(schedule => ({
        ...schedule,
        key: schedule._id
      })));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }; 

  const data = {
    errorLogs,
    applications,
    allCategories,
    stats,
    leads,
    users,
    calls,
    experts,
    schedules,
    fetchData
  };

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
};
