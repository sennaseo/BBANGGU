import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰 갱신 로직 제거하고 바로 로그인 페이지로 리다이렉트
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 