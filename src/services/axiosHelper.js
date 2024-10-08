import axios from "axios";

export const FINAL_URL = 'https://6x4j0qxbmk.execute-api.ap-south-1.amazonaws.com/main/actions';
// export const FINAL_URL = "http://localhost:8080/actions";

export const Raxios = axios.create({ baseURL: FINAL_URL });

Raxios.interceptors.request.use(
  (config) => {
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
  window.location.href = '/';
};

const refreshFaxiosAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  try {
    let response = await axios.post(`${FINAL_URL}/admin_auth`,
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