import Raxios from './axiosHelper';

export const fetchCategories = async (setCategories) => {
    try {
        const response = await Raxios.get('/data/categories');
        setCategories(response.data);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

export const fetchStats = async (setStats) => {
    try {
        const response = await Raxios.get('/service/dashboardstats');
        setStats(response.data);
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
};

export const fetchInsights = async (setInsights) => {
    try {
        const response = await Raxios.get('/service/callinsights');
        setInsights(response.data);
    } catch (error) {
        console.error('Error fetching insights:', error);
    }
};

export const fetchLeads = async (setLeads) => {
    try {
        const response = await Raxios.get('/user/leads');
        setLeads(response.data);
    } catch (error) {
        console.error('Error fetching leads:', error);
    }
};

export const fetchUsers = async (setUsers) => {
    try {
        const response = await Raxios.get('/data/users');
        setUsers(response.data);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

export const fetchCalls = async (setCalls) => {
    try {
        const response = await Raxios.get('/data/calls');
        setCalls(response.data.reverse());
    } catch (error) {
        console.error('Error fetching calls:', error);
    }
};

export const fetchExperts = async (setExperts) => {
    try {
        const response = await Raxios.get('/data/experts');
        setExperts(response.data);
    } catch (error) {
        console.error('Error fetching experts:', error);
    }
};

export const fetchEvents = async (setEvents) => {
    try {
        const response = await Raxios.get('/event/events');
        setEvents(response.data);
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

export const fetchShorts = async (setShorts) => {
    try {
        const response = await Raxios.get('/content/shorts');
        setShorts(response.data);
    } catch (error) {
        console.error('Error fetching shorts:', error);
    }
};

export const fetchEngagementData = async (page, size) => {
    try {
        const response = await Raxios.get('/user/engagementData', {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching engagement data:', error);
        window.alert('Error fetching engagement data');
    }
};