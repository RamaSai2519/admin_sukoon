import React, { createContext, useContext, useState } from 'react';
import {
    fetchCategories,
    fetchStats,
    fetchInsights,
    fetchUsers,
    fetchCalls,
    fetchExperts,
} from './fetchData';

// Create contexts
const CategoriesContext = createContext();
const InsightsContext = createContext();
const ExpertsContext = createContext();
const StatsContext = createContext();
const UsersContext = createContext();
const CallsContext = createContext();

// Export hooks to use contexts
export const useCategories = () => useContext(CategoriesContext);
export const useInsights = () => useContext(InsightsContext);
export const useExperts = () => useContext(ExpertsContext);
export const useStats = () => useContext(StatsContext);
export const useUsers = () => useContext(UsersContext);
export const useCalls = () => useContext(CallsContext);

export const DataProvider = ({ children }) => {
    const [allCategories, setCategories] = useState([]);
    const [experts, setExperts] = useState([]);
    const [users, setUsers] = useState([]);
    const [calls, setCalls] = useState([]);
    const [stats, setStats] = useState({
            total_calls: '0',
            today_calls: '0',
            successful_calls: '0',
            today_successful_calls: '0',
            failed_calls: '0',
            today_failed_calls: '0',
            missed_calls: '0',
            today_missed_calls: '0',
            average_call_duration: '0',
            total_duration: '0',
            scheduled_calls_percentage: '0',
            avg_conversation_score: '0',
            onlineSarathis: []
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
        allCategories: { allCategories, fetchCategories: () => fetchCategories(setCategories) },
        insights: { insights, fetchInsights: () => fetchInsights(setInsights) },
        experts: { experts, fetchExperts: () => fetchExperts(setExperts) },
        stats: { stats, fetchStats: () => fetchStats(setStats) },
        users: { users, fetchUsers: () => fetchUsers(setUsers) },
        calls: { calls, fetchCalls: () => fetchCalls(setCalls) },
    };

    return (
        <CategoriesContext.Provider value={contextValues.allCategories}>
            <StatsContext.Provider value={contextValues.stats}>
                <InsightsContext.Provider value={contextValues.insights}>
                    <UsersContext.Provider value={contextValues.users}>
                        <CallsContext.Provider value={contextValues.calls}>
                            <ExpertsContext.Provider value={contextValues.experts}>
                                {children}
                            </ExpertsContext.Provider>
                        </CallsContext.Provider>
                    </UsersContext.Provider>
                </InsightsContext.Provider>
            </StatsContext.Provider>
        </CategoriesContext.Provider>
    );
};
