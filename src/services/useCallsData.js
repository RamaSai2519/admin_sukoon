import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

const LeadsDataContext = React.createContext();

export const useLeadsData = () => {
  return useContext(LeadsDataContext);
};

export const LeadsDataProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get('/api/leads');
        setLeads(response.data);
      } catch (error) {
        console.error('Error fetching all leads:', error);
      }
    };

    fetchLeads();
  }, []);

  return (
    <LeadsDataContext.Provider value={{ leads }}>
      {children}
    </LeadsDataContext.Provider>
  );
};

const CallsDataContext = React.createContext();

export const useCallsData = () => {
  return useContext(CallsDataContext);
};

export const CallsDataProvider = ({ children }) => {
  const [calls, setCalls] = useState([]);
  

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await axios.get('/api/calls');
        setCalls(response.data.reverse());
      } catch (error) {
        console.error('Error fetching all calls:', error);
      }
    };

    fetchCalls();
  }, []);

  return (
    <CallsDataContext.Provider value={{ calls }}>
      {children}
    </CallsDataContext.Provider>
  );
};


const ExpertManagementContext = React.createContext();

export const useExpertManagement = () => {
  return useContext(ExpertManagementContext);
};

export const ExpertManagementProvider = ({ children }) => {
  const [experts, setExperts] = useState([]);

  useEffect(() => {
    const fetchAllExperts = async () => {
      try {
        const response = await axios.get('/api/experts');
        setExperts(response.data);
      } catch (error) {
        console.error('Error fetching all experts:', error);
      }
    };

    fetchAllExperts();
  }, []);

  return (
    <ExpertManagementContext.Provider value={{ experts }}>
      {children}
    </ExpertManagementContext.Provider>
  );
};
