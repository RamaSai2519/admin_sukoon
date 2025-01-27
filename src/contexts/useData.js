import React, { createContext, useContext, useState } from 'react';
import CryptoJS from 'crypto-js';
import {
    fetchPlatformCategories,
    fetchCategories,
    fetchStats,
    fetchInsights,
    fetchUsers,
    fetchCalls,
    fetchExperts,
} from '../services/fetchData';

const PlatformCategoriesContext = createContext();
const CategoriesContext = createContext();
const InsightsContext = createContext();
const FiltersContext = createContext();
const ExpertsContext = createContext();
const StatsContext = createContext();
const UsersContext = createContext();
const CallsContext = createContext();

export const usePlatformCategories = () => useContext(PlatformCategoriesContext);
export const useCategories = () => useContext(CategoriesContext);
export const useInsights = () => useContext(InsightsContext);
export const useExperts = () => useContext(ExpertsContext);
export const useFilters = () => useContext(FiltersContext);
export const useStats = () => useContext(StatsContext);
export const useUsers = () => useContext(UsersContext);
export const useCalls = () => useContext(CallsContext);

const SECRET_KEY = 'sukoon';

export const useAdmin = () => {
    const getAdmin = () => {
        const encryptedAdmin = localStorage.getItem('admin');
        if (!encryptedAdmin) return {};
        const bytes = CryptoJS.AES.decrypt(encryptedAdmin, SECRET_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    };

    const setAdmin = (admin) => {
        const encryptedAdmin = CryptoJS.AES.encrypt(JSON.stringify(admin), SECRET_KEY).toString();
        localStorage.setItem('admin', encryptedAdmin);
    };

    return { admin: getAdmin(), setAdmin };
};

export const DataProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [calls, setCalls] = useState([]);
    const [filters, setFilters] = useState({});
    const [experts, setExperts] = useState([]);
    const [insights, setInsights] = useState({});
    const [allCategories, setCategories] = useState([]);
    const [stats, setStats] = useState({ onlineSarathis: [] });
    const [platformCategories, setPlatformCategories] = useState([]);

    const contextValues = {
        filters: { filters, setFilters },
        users: { users, fetchUsers: () => fetchUsers(setUsers) },
        stats: { stats, fetchStats: (internal) => fetchStats(setStats, internal) },
        calls: { calls, fetchCalls: (internal) => fetchCalls(setCalls, internal) },
        experts: { experts, fetchExperts: (internal) => fetchExperts(setExperts, internal) },
        allCategories: { allCategories, fetchCategories: () => fetchCategories(setCategories) },
        insights: { insights, fetchInsights: (internal) => fetchInsights(setInsights, internal) },
        platformCategories: { platformCategories, fetchPlatformCategories: () => fetchPlatformCategories(setPlatformCategories) },
    };

    return (
        <PlatformCategoriesContext.Provider value={contextValues.platformCategories}>
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
        </PlatformCategoriesContext.Provider>
    );
};
