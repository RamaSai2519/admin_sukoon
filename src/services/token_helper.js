import Raxios from "./axiosHelper";

export const get_token = async (user, balance) => {
    try {
        const response = await Raxios.post('/actions/eligibility', {
            intent: 'perform', user, balance
        });
        if (response.data.token) return response.data.token;
        return null;
    }
    catch (error) {
        return null;
    }
};

export const get_balance_type = async (expert_id) => {
    try {
        const response = await Raxios.get('/actions/expert', {
            params: { expert_id ,req_calls: false }
        });
        return response.data.type === 'expert' ? 'expert_calls' : 'sarathi_calls';
    } catch (error) {
        return null;
    }
};