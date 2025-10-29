import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hr18.dwf.com.sa/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

let authToken = null;

export const setAuthToken = token => {
  authToken = token;
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

api.interceptors.response.use(
  response => response,
  error => Promise.reject(error.response?.data || error.message),
);

export const apiCall = async (method, url, data = null, params = {}) => {
  try {
    const response = await api({ method, url, data, params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
