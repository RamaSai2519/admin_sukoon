import React, { createContext, useContext, useState } from 'react';
import {
    fetchErrorLogs,
    fetchApplications,
    fetchCategories,
    fetchStats,
    fetchLeads,
    fetchUsers,
    fetchCalls,
    fetchExperts,
    fetchSchedules
} from './fetchData';

// Create contexts
const ErrorLogsContext = createContext();
const ApplicationsContext = createContext();
const CategoriesContext = createContext();
const StatsContext = createContext();
const LeadsContext = createContext();
const UsersContext = createContext();
const CallsContext = createContext();
const ExpertsContext = createContext();
const SchedulesContext = createContext();

// Export hooks to use contexts
export const useErrorLogs = () => useContext(ErrorLogsContext);
export const useApplications = () => useContext(ApplicationsContext);
export const useCategories = () => useContext(CategoriesContext);
export const useStats = () => useContext(StatsContext);
export const useLeads = () => useContext(LeadsContext);
export const useUsers = () => useContext(UsersContext);
export const useCalls = () => useContext(CallsContext);
export const useExperts = () => useContext(ExpertsContext);
export const useSchedules = () => useContext(SchedulesContext);

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
        totalCalls: "",
        successfulCalls: "",
        todayCalls: 0,
        todaySuccessfulCalls: 0,
        averageCallDuration: "",
        failedCalls: "",
        todayFailedCalls: 0,
        onlineSaarthis: []
    });

    const contextValues = {
        errorLogs: { errorLogs, fetchErrorLogs: () => fetchErrorLogs(setErrorLogs) },
        applications: { applications, fetchApplications: () => fetchApplications(setApplications) },
        allCategories: { allCategories, fetchCategories: () => fetchCategories(setCategories) },
        stats: { stats, fetchStats: () => fetchStats(setStats) },
        leads: { leads, fetchLeads: () => fetchLeads(setLeads) },
        users: { users, fetchUsers: () => fetchUsers(setUsers) },
        calls: { calls, fetchCalls: () => fetchCalls(setCalls) },
        experts: { experts, fetchExperts: () => fetchExperts(setExperts) },
        schedules: { schedules, fetchSchedules: () => fetchSchedules(setSchedules) }
    };

    return (
        <ErrorLogsContext.Provider value={contextValues.errorLogs}>
            <ApplicationsContext.Provider value={contextValues.applications}>
                <CategoriesContext.Provider value={contextValues.allCategories}>
                    <StatsContext.Provider value={contextValues.stats}>
                        <LeadsContext.Provider value={contextValues.leads}>
                            <UsersContext.Provider value={contextValues.users}>
                                <CallsContext.Provider value={contextValues.calls}>
                                    <ExpertsContext.Provider value={contextValues.experts}>
                                        <SchedulesContext.Provider value={contextValues.schedules}>
                                            {children}
                                        </SchedulesContext.Provider>
                                    </ExpertsContext.Provider>
                                </CallsContext.Provider>
                            </UsersContext.Provider>
                        </LeadsContext.Provider>
                    </StatsContext.Provider>
                </CategoriesContext.Provider>
            </ApplicationsContext.Provider>
        </ErrorLogsContext.Provider>
    );
};
