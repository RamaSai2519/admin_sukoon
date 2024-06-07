import React, { createContext, useContext, useState } from 'react';
import {
    fetchErrorLogs,
    fetchApplications,
    fetchCategories,
    fetchStats,
    fetchInsights,
    fetchLeads,
    fetchUsers,
    fetchCalls,
    fetchExperts,
    fetchSchedules,
    fetchEvents
} from './fetchData';

// Create contexts
const ErrorLogsContext = createContext();
const ApplicationsContext = createContext();
const CategoriesContext = createContext();
const StatsContext = createContext();
const InsightsContext = createContext();
const LeadsContext = createContext();
const UsersContext = createContext();
const CallsContext = createContext();
const ExpertsContext = createContext();
const SchedulesContext = createContext();
const EventsContext = createContext();

// Export hooks to use contexts
export const useErrorLogs = () => useContext(ErrorLogsContext);
export const useApplications = () => useContext(ApplicationsContext);
export const useCategories = () => useContext(CategoriesContext);
export const useStats = () => useContext(StatsContext);
export const useInsights = () => useContext(InsightsContext);
export const useLeads = () => useContext(LeadsContext);
export const useUsers = () => useContext(UsersContext);
export const useCalls = () => useContext(CallsContext);
export const useExperts = () => useContext(ExpertsContext);
export const useSchedules = () => useContext(SchedulesContext);
export const useEvents = () => useContext(EventsContext);

export const DataProvider = ({ children }) => {
    const [errorLogs, setErrorLogs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [allCategories, setCategories] = useState([]);
    const [leads, setLeads] = useState([]);
    const [users, setUsers] = useState([]);
    const [calls, setCalls] = useState([]);
    const [experts, setExperts] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({
        totalCalls: 0,
        todayCalls: 0,
        successfulCalls: 0,
        todaySuccessfulCalls: 0,
        failedCalls: 0,
        todayFailedCalls: 0,
        missedCalls: 0,
        todayMissedCalls: 0,
        averageCallDuration: "",
        totalDuration: 0,
        scheduledCallsPercentage: 0,
        averageConversationScore: 0,
        onlineSaarthis: []
    });
    const [insights, setInsights] = useState({
        _15min: "",
        _15_30min: "",
        _30_45min: "",
        _45_60min: "",
        _60min_: "",
        first_calls_split: "",
        second_calls_split: "",
        repeat_calls_split: "",
        one_call: "",
        two_calls: "",
        repeat_calls: "",
        organic_avg_duration: "",
        scheduled_avg_duration: ""
    });


    const contextValues = {
        errorLogs: { errorLogs, fetchErrorLogs: () => fetchErrorLogs(setErrorLogs) },
        applications: { applications, fetchApplications: () => fetchApplications(setApplications) },
        allCategories: { allCategories, fetchCategories: () => fetchCategories(setCategories) },
        stats: { stats, fetchStats: () => fetchStats(setStats) },
        insights: { insights, fetchInsights: () => fetchInsights(setInsights) },
        leads: { leads, fetchLeads: () => fetchLeads(setLeads) },
        users: { users, fetchUsers: () => fetchUsers(setUsers) },
        calls: { calls, fetchCalls: () => fetchCalls(setCalls) },
        experts: { experts, fetchExperts: () => fetchExperts(setExperts) },
        schedules: { schedules, fetchSchedules: () => fetchSchedules(setSchedules) },
        events: { events, fetchEvents: () => fetchEvents(setEvents) }
    };

    return (
        <ErrorLogsContext.Provider value={contextValues.errorLogs}>
            <ApplicationsContext.Provider value={contextValues.applications}>
                <CategoriesContext.Provider value={contextValues.allCategories}>
                    <StatsContext.Provider value={contextValues.stats}>
                        <InsightsContext.Provider value={contextValues.insights}>
                            <LeadsContext.Provider value={contextValues.leads}>
                                <UsersContext.Provider value={contextValues.users}>
                                    <CallsContext.Provider value={contextValues.calls}>
                                        <ExpertsContext.Provider value={contextValues.experts}>
                                            <SchedulesContext.Provider value={contextValues.schedules}>
                                                <EventsContext.Provider value={contextValues.events}>
                                                    {children}
                                                </EventsContext.Provider>
                                            </SchedulesContext.Provider>
                                        </ExpertsContext.Provider>
                                    </CallsContext.Provider>
                                </UsersContext.Provider>
                            </LeadsContext.Provider>
                        </InsightsContext.Provider>
                    </StatsContext.Provider>
                </CategoriesContext.Provider>
            </ApplicationsContext.Provider>
        </ErrorLogsContext.Provider>
    );
};
