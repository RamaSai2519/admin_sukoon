import React, { createContext, useContext, useState } from 'react';
import {
    fetchCategories,
    fetchStats,
    fetchInsights,
    fetchUsers,
    fetchCalls,
    fetchExperts,
} from './fetchData';

const CategoriesContext = createContext();
const InsightsContext = createContext();
const FiltersContext = createContext();
const ExpertsContext = createContext();
const StatsContext = createContext();
const UsersContext = createContext();
const CallsContext = createContext();

export const useCategories = () => useContext(CategoriesContext);
export const useInsights = () => useContext(InsightsContext);
export const useExperts = () => useContext(ExpertsContext);
export const useFilters = () => useContext(FiltersContext);
export const useStats = () => useContext(StatsContext);
export const useUsers = () => useContext(UsersContext);
export const useCalls = () => useContext(CallsContext);

export const DataProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [calls, setCalls] = useState([]);
    const [filters, setFilters] = useState({});
    const [experts, setExperts] = useState([]);
    const [insights, setInsights] = useState({});
    const [allCategories, setCategories] = useState([]);
    const [stats, setStats] = useState({ onlineSarathis: [] });


    const contextValues = {
        filters: { filters, setFilters },
        users: { users, fetchUsers: () => fetchUsers(setUsers) },
        stats: { stats, fetchStats: (internal) => fetchStats(setStats, internal) },
        calls: { calls, fetchCalls: (internal) => fetchCalls(setCalls, internal) },
        experts: { experts, fetchExperts: (internal) => fetchExperts(setExperts, internal) },
        allCategories: { allCategories, fetchCategories: () => fetchCategories(setCategories) },
        insights: { insights, fetchInsights: (internal) => fetchInsights(setInsights, internal) },
    };

    return (
        <CategoriesContext.Provider value={contextValues.allCategories}>
            <StatsContext.Provider value={contextValues.stats}>
                <InsightsContext.Provider value={contextValues.insights}>
                    <UsersContext.Provider value={contextValues.users}>
                        <CallsContext.Provider value={contextValues.calls}>
                            <ExpertsContext.Provider value={contextValues.experts}>
                                <FiltersContext.Provider value={contextValues.filters}>
                                    {children}
                                </FiltersContext.Provider>
                            </ExpertsContext.Provider>
                        </CallsContext.Provider>
                    </UsersContext.Provider>
                </InsightsContext.Provider>
            </StatsContext.Provider>
        </CategoriesContext.Provider>
    );
};
