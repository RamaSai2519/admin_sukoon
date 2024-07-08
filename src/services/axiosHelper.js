import axios from 'axios';

// export const BASE_URL = 'http://localhost:8080/admin'
export const BASE_URL = 'https://rama.sukoonunlimited.com/admin'
// export const BASE_URL = 'https://m196vr75-8080.inc1.devtunnels.ms/admin'

const Raxios = axios.create({
  baseURL: BASE_URL
});

Raxios.interceptors.request.use(
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

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  try {
    const response = await axios.post(`${BASE_URL}/auth/refresh`, null, {
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
};

// Interceptor to handle 401 errors
Raxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return Raxios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default Raxios;
