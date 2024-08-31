import axios from "axios";

export const FINAL_URL = 'https://ij8f1oonya.execute-api.ap-south-1.amazonaws.com/dev/actions';
// export const FINAL_URL = "http://localhost:8080/actions";

export const Faxios = axios.create({ baseURL: FINAL_URL, timeout: 10000 });

Faxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

Faxios.interceptors.response.use(
    (response) => {
        console.log('response', response);
        response.data = response.data.output_details;
        response.status = response.data.output_status === 'SUCCESS' ? 200 : 400;
        response.msg = response.data.output_message;
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshFaxiosAccessToken();
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return Faxios(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

const refreshFaxiosAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    try {
        const response = await axios.post(`${FINAL_URL}/auth/refresh`,
            { action: 'refresh' }, {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        });
        const newAccessToken = response.data.access_token;
        localStorage.setItem('access_token', newAccessToken);
        return newAccessToken;
    } catch (error) {
        console.error('Failed to refresh access token', error);
        localStorage.clear();
        window.location.href = '/';
    }
}

export default Faxios;