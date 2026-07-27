import axios from 'axios';
import { store } from '../store';
import { loginSuccess, logout, removeLocalStorage } from '../store/slices/authSlice';
import { API_BASE_URL } from '../config/env';

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // refreshToken 쿠키를 주고받으려면 필수
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

// --- 401 자동 재발급 (refresh) ---
// 백엔드 /auth/token/refresh 는 refreshToken 쿠키를 검증하고 새 access token을 body로 준다.
// access token 만료(401) 시 refresh 를 1회만 호출하고, 그동안 들어온 다른 401 요청은
// 큐에 모아두었다가 재발급이 끝나면 새 토큰으로 한꺼번에 재시도한다.
let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

const flushQueue = (token: string | null) => {
  pendingQueue.forEach((cb) => cb(token));
  pendingQueue = [];
};

const persistToken = (accessToken: string, userType: string | null) => {
  // store + localStorage 둘 다 갱신 (생 axios 를 쓰는 화면들도 localStorage 를 읽으므로)
  store.dispatch(loginSuccess({ data: { access_token: accessToken, user_type: userType ?? '' } }));
  localStorage.setItem('accessToken', accessToken);
  if (userType) localStorage.setItem('userType', userType);
  localStorage.setItem('isAuthenticated', 'true');
};

const forceLogout = () => {
  store.dispatch(logout());
  store.dispatch(removeLocalStorage());
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // 401 이 아니거나, refresh 요청 자체가 실패했거나, 이미 재시도한 요청이면 그대로 실패
    if (
      status !== 401 ||
      !original ||
      original._retry ||
      original.url?.includes('/auth/token/refresh')
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    // 이미 다른 요청이 refresh 중이면, 끝날 때까지 기다렸다가 새 토큰으로 재시도
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((token) => {
          if (token) {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(instance(original));
          } else {
            reject(error);
          }
        });
      });
    }

    isRefreshing = true;
    try {
      const { data } = await instance.post('/auth/token/refresh');
      const newToken: string = data?.data?.access_token;
      const userType: string | null = data?.data?.user_type ?? null;
      if (!newToken) throw new Error('no access_token in refresh response');

      persistToken(newToken, userType);
      flushQueue(newToken);

      original.headers.Authorization = `Bearer ${newToken}`;
      return instance(original);
    } catch (refreshError) {
      // refresh 실패 = refreshToken 만료/무효 → 로그아웃 처리
      flushQueue(null);
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default instance;
