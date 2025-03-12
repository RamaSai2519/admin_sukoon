import axios from "axios";
import { message } from "antd";

const PROD_URL = 'https://6x4j0qxbmk.execute-api.ap-south-1.amazonaws.com/main';
const DEV_URL = 'https://wivq47mgh6.execute-api.ap-south-1.amazonaws.com/dev';
const LOCAL_URL = 'http://localhost:8080';
const ENV = process.env.REACT_APP_ENV;

let FINAL_URL = '';
if (ENV === 'dev') {
  FINAL_URL = DEV_URL
  message.info('You are in Development Environment');
} else if (ENV === 'local') {
  FINAL_URL = LOCAL_URL
  message.info('You are in Local Environment');
} else {
  FINAL_URL = PROD_URL
}

export const MARK_URL = "https://mark.sukoonunlimited.com";

export const Raxios = axios.create({ baseURL: FINAL_URL });
export const Maxios = axios.create({ baseURL: MARK_URL });

Raxios.interceptors.request.use(
  (config) => {
    if (config.headers.Authorization) return config;
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const logout_user = () => {
  localStorage.clear();
  const currentLocation = window.location.pathname;
  window.location.href = `/?redirect=${currentLocation}`;
};

const refreshFaxiosAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  try {
    let response = await axios.post(`${FINAL_URL}/actions/admin_auth`,
      { action: 'refresh' }, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    });
    response = await format_response(response);
    if (response.status !== 200) logout_user();
    const newAccessToken = response.data.access_token;
    localStorage.setItem('access_token', newAccessToken);
    return newAccessToken;
  } catch (error) {
    logout_user();
  }
};

const format_response = async (response) => {
  if ("output_details" in response.data) {
    return {
      data: response.data.output_details,
      status: response.data.output_status === 'SUCCESS' ? 200 : 400,
      msg: response.data.output_message,
      originalResponse: response,
    };
  }
  return response;
}

Raxios.interceptors.response.use(
  (response) => {
    return format_response(response);
  },
  async (error) => {
    const originalRequest = error.config;
    if ((error.response.status === 500 || 401) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshFaxiosAccessToken();
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