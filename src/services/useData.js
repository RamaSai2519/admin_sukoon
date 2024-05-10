import React, { useState, useEffect, useContext } from 'react';
import Raxios from './axiosHelper';

const LeadsDataContext = React.createContext();

export const useLeadsData = () => {
  return useContext(LeadsDataContext);
};

export const LeadsDataProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await Raxios.get('/api/leads');
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

const UserDataContext = React.createContext();

export const useUserData = () => {
  return useContext(UserDataContext);
};

export const UserDataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await Raxios.get('/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching all users:', error);
      }
    };

    fetchUsers();
  }
    , []);

  return (
    <UserDataContext.Provider value={{ users }}>
      {children}
    </UserDataContext.Provider>
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
        const response = await Raxios.get('/api/calls');
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
        const response = await Raxios.get('/api/experts');
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
