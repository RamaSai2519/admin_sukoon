import { message } from 'antd';
import Raxios from './axiosHelper';
import Faxios from './raxiosHelper';

export const fetchFilteredData = async (page, size, setPage, setSize, setData, setTotal, setLoading, filter, collection, optional) => {
    setLoading(true);
    try {
        const response = await Raxios.post('/data/filter', {
            page, size, filter, collection,
            ...(optional && { ...optional })
        });
        setSize(response.data.size);
        setPage(response.data.page);
        setData(response.data.data);
        setTotal(response.data.total);
    } catch (error) {
        message.error('Error fetching data:', error);
        window.alert('Error fetching data');
    }
    setLoading(false);
};

export const fetchPagedData = async (page, size, setData, setTotal, setLoading, endpoint, optional) => {
    setLoading(true);
    try {
        const response = await Raxios.get(endpoint, {
            params: {
                page, size,
                ...(optional && { ...optional })
            }
        });
        setData(response.data.data);
        setTotal(response.data.total);
    } catch (error) {
        message.error('Error fetching data:', error);
    }
    setLoading(false);
};

export const raxiosFetchData = async (page, size, setData, setTotal, endpoint, optional) => {
    try {
        const response = await Faxios.get(endpoint, {
            params: {
                ...(size && { size }),
                ...(page && { page }),
                ...(optional && { ...optional })
            }
        });
        if (response.status !== 200) {
            message.error(response.msg);
            return;
        } else {
            setData && setData(response.data.data);
            setTotal && setTotal(response.data.total);
            return response.data;
        }
    } catch (error) {
        message.error(error.response?.data?.message || 'An error occurred');
    }
};

export const fetchData = async (setData, setLoading, endpoint, optional) => {
    setLoading && setLoading(true);
    try {
        const response = await Raxios.get(endpoint, {
            params: {
                ...(optional && { ...optional })
            }
        });
        setData(response.data.data);
    } catch (error) {
        message.error('Error fetching data:', error);
    }
    setLoading && setLoading(false);
};

export const fetchCategories = async (setCategories) => {
    try {
        const response = await Raxios.get('/data/categories');
        setCategories(response.data);
    } catch (error) {
        message.error('Error fetching categories:', error);
    }
};

export const fetchStats = async (setStats, internal = false) => {
    try {
        const response = await Faxios.get('/dashboard_stats', {
            params: { item: 'stats', internal }
        });
        setStats(response.data);
    } catch (error) {
        message.error('Error fetching stats:', error);
    }
};

export const fetchInsights = async (setInsights, internal = false) => {
    try {
        const response = await Faxios.get('/dashboard_stats', {
            params: { item: 'insights', internal }
        });
        setInsights(response.data);
    } catch (error) {
        message.error('Error fetching insights:', error);
    }
};

export const fetchUsers = async (setUsers) => {
    try {
        const response = await Faxios.get('/user');
        setUsers(response.data);
    } catch (error) {
        message.error('Error fetching users:', error);
    }
};

export const fetchCalls = async (setCalls, internal = false) => {
    try {
        const response = await Faxios.get('/call', {
            params: { dest: 'graph', internal }
        });
        setCalls(response.data.data);
        if (response.status !== 200) {
            message.error(response.msg);
            return;
        } else {
            return response.data;
        }
    } catch (error) {
        message.error(error.response?.data?.message || 'An error occurred');
    }
};

export const fetchExperts = async (setExperts) => {
    try {
        const response = await Faxios.get('/expert');
        setExperts(response.data);
    } catch (error) {
        message.error('Error fetching experts:', error);
    }
};

export const fetchShorts = async (setShorts) => {
    try {
        const response = await Raxios.get('/content/shorts');
        setShorts(response.data);
    } catch (error) {
        message.error('Error fetching shorts:', error);
    }
};

export const fetchEngagementData = async (page, size) => {
    try {
        const response = await Raxios.get('/user/engagementData', {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        message.error('Error fetching engagement data:', error);
        window.alert('Error fetching engagement data');
    }
};