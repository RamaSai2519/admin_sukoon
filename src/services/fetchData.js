import { message } from 'antd';
import Raxios from './axiosHelper';

export const raxiosFetchData = async (page, size, setData, setTotal, endpoint, optional, setLoading, notify = false) => {
    setLoading && setLoading(true);
    try {
        const response = await Raxios.get(endpoint, {
            params: {
                ...(size && { size }),
                ...(page && { page }),
                ...(optional && { ...optional })
            }
        });
        if (response.status !== 200) {
            message.error(response.msg + '. Please refresh the page!', 10);
            return;
        } else {
            setData && setData(response.data.data);
            setTotal && setTotal(response.data.total);
            setLoading && setLoading(false);
            notify && message.success(response.msg);
            return response.data;
        }
    } catch (error) {
        message.error(error.response?.data?.message || 'An error occurred');
        setLoading && setLoading(false);
    }
};

export const RaxiosPost = async (url, data, isNotify = false, setLoading = null) => {
    setLoading && setLoading(true);
    try {
        const response = await Raxios.post(url, data);
        if (isNotify) {
            if (response.status === 200) {
                await message.success(response.msg);
            } else {
                await message.error(response.msg);
            }
        }
        setLoading && setLoading(false);
        return response;
    } catch (error) {
        await message.error(error.response?.data?.output_message || 'An error occurred');
        setLoading && setLoading(false);
    }
};

export const fetchCategories = async (setCategories) => {
    try {
        const response = await Raxios.post('/actions/categories', { action: 'get' });
        setCategories(response.data);
    } catch (error) {
        message.error('Error fetching categories:', error);
    }
};

export const fetchPlatformCategories = async (setPlatformCategories) => {
    function getSubCategories(arr) {
        let tempArr = []; let n = arr.length;
        for (let i = 0; i < Math.ceil(n / 2); i++) {
            if (arr[i]?.sub_categories?.length > 0) { tempArr.push(...arr[i].sub_categories); }
            if (i !== n - i - 1 && arr[n - i - 1]?.sub_categories?.length > 0) tempArr.push(...arr[n - i - 1].sub_categories);
        }
        return tempArr;
    }
    try {
        const response = await Raxios.get('/actions/platform_category?type=main');
        return setPlatformCategories(getSubCategories(response.data.data))
    } catch (error) {
        message.error('Error fetching experts:', error);
    }
}

export const fetchStats = async (setStats, internal = false) => {
    try {
        const response = await Raxios.get('/actions/dashboard_stats', {
            params: { item: 'stats', internal }
        });
        setStats(response.data);
    } catch (error) {
        message.error('Error fetching stats:', error);
    }
};

export const fetchInsights = async (setInsights, internal = false) => {
    try {
        const response = await Raxios.get('/actions/dashboard_stats', {
            params: { item: 'insights', internal }
        });
        setInsights(response.data);
    } catch (error) {
        message.error('Error fetching insights:', error);
    }
};

export const fetchUsers = async (setUsers) => {
    try {
        const response = await Raxios.get('/actions/user');
        setUsers(response.data);
    } catch (error) {
        message.error('Error fetching users:', error);
    }
};

export const fetchCalls = async (setCalls, internal = false) => {
    try {
        const response = await Raxios.get('/actions/call', {
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
        const response = await Raxios.get('/actions/expert', {
            params: { internal, platform: 'admin' }
        });
        setExperts(response.data);
    } catch (error) {
        message.error('Error fetching experts:', error);
    }
};

export const fetchEngagementData = async (page, size) => {
    try {
        const response = await Raxios.get('/actions/user/engagementData', {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        message.error('Error fetching engagement data:', error);
        window.alert('Error fetching engagement data');
    }
};


