import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://i12d102.p.ssafy.io:8081',  // API 서버 URL 직접 사용
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_USER_TOKEN}`
  },
  withCredentials: true
});

// 요청 URL 로깅
axiosInstance.interceptors.request.use(
  config => {
    console.log('요청 시작 >>>>>', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    return config;
  }
);

// 요청 순서 확인을 위한 인터셉터
axiosInstance.interceptors.request.use(
  config => {
    console.log('요청 시작 >>>>>', {
      url: config.url,
      method: config.method,
      headers: config.headers
    });
    return config;
  }
);

// 응답 순서 확인을 위한 인터셉터
axiosInstance.interceptors.response.use(
  response => {
    console.log('응답 완료 <<<<<', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('API 에러:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    });

    return Promise.reject(error);
  }
);

export default axiosInstance; 