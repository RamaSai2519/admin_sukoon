import { message } from 'antd';
import Raxios from './axiosHelper';
import Faxios from './raxiosHelper';

export const raxiosFetchData = async (page, size, setData, setTotal, endpoint, optional, setLoading) => {
    setLoading && setLoading(true);
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
            setLoading && setLoading(false);
            return response.data;
        }
    } catch (error) {
        message.error(error.response?.data?.message || 'An error occurred');
        setLoading && setLoading(false);
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
        const response = await Faxios.post('/categories', { action: 'get' });
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

export const fetchExperts = async (setExperts, internal) => {
    try {
        const response = await Faxios.get('/expert', {
            params: { internal }
        });
        setExperts(response.data);
    } catch (error) {
        message.error('Error fetching experts:', error);
    }
};


export const fetchEngagementData = async (page, size) => {
    try {
        const response = await Faxios.get('/user/engagementData', {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        message.error('Error fetching engagement data:', error);
        window.alert('Error fetching engagement data');
    }
};