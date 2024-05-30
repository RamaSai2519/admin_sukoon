import Raxios from './axiosHelper';

export const fetchErrorLogs = async (setErrorLogs) => {
    try {
        const response = await Raxios.get('/data/errorlogs');
        setErrorLogs(response.data.reverse());
    } catch (error) {
        console.error('Error fetching error logs:', error);
    }
};

export const fetchApplications = async (setApplications) => {
    try {
        const response = await Raxios.get('/data/applications');
        setApplications(response.data.reverse());
    } catch (error) {
        console.error('Error fetching applications:', error);
    }
};

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

export const fetchSchedules = async (setSchedules) => {
    try {
        const response = await Raxios.get('/data/schedules');
        setSchedules(response.data.map(schedule => ({
            ...schedule,
            key: schedule._id
        })));
    } catch (error) {
        console.error('Error fetching schedules:', error);
    }
};
