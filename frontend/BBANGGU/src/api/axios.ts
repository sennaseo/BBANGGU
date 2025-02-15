import axios from 'axios';
import { store } from '../store';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

instance.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['Content-Type'] = 'application/json';
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 토큰 만료 등 에러 처리 로직
    return Promise.reject(error);
  }
);

export default instance;