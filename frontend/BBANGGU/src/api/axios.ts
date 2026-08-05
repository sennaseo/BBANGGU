import axios from 'axios';
import { store } from '../store';
import { loginSuccess, logout, removeLocalStorage } from '../store/slices/authSlice';
import { API_BASE_URL } from '../config/env';

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // refreshToken 쿠키를 주고받으려면 필수
});

instance.interceptors.request.use((config) => {
  // 인증은 httpOnly accessToken 쿠키가 담당한다 (withCredentials). Authorization 헤더는 붙이지 않는다.

  // FormData인 경우 Content-Type 헤더를 설정하지 않음
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

// --- 401 자동 재발급 (refresh) ---
// 백엔드 /auth/token/refresh 는 refreshToken 쿠키를 검증하고 새 accessToken 쿠키를 내려준다.
// 토큰 자체는 JS가 볼 수 없으므로, 여기서는 "재발급 성공 여부"만 알면 된다.
// accessToken 만료(401) 시 refresh 를 1회만 호출하고, 그동안 들어온 다른 401 요청은
// 큐에 모아두었다가 재발급이 끝나면 한꺼번에 재시도한다.
let isRefreshing = false;
let pendingQueue: Array<(ok: boolean) => void> = [];

const flushQueue = (ok: boolean) => {
  pendingQueue.forEach((cb) => cb(ok));
  pendingQueue = [];
};

const persistAuth = (userType: string | null) => {
  // 쿠키는 브라우저가 갱신했다. 앱은 로그인 상태 표시용 정보만 들고 있는다.
  store.dispatch(loginSuccess({ data: { user_type: userType ?? '' } }));
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

    // 이미 다른 요청이 refresh 중이면, 끝날 때까지 기다렸다가 재시도
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((ok) => {
          if (ok) {
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
      const userType: string | null = data?.data?.user_type ?? null;

      persistAuth(userType);
      flushQueue(true);

      return instance(original);
    } catch (refreshError) {
      // refresh 실패 = refreshToken 만료/무효 → 로그아웃 처리
      flushQueue(false);
      forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default instance;
