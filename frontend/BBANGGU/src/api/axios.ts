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
  
  // FormData인 경우 Content-Type 헤더를 설정하지 않음
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 토큰 만료 등 에러 처리 로직
    return Promise.reject(error);
  }
);

// 디버깅을 위한 로그
console.log('=== Axios Instance 설정 ===');
console.log('baseURL:', instance.defaults.baseURL);
console.log('headers:', instance.defaults.headers);

export default instance;