import axios from 'axios';
import { API_BASE_URL } from '../../../config/env';

const BASE_URL = API_BASE_URL;

interface ApiResponse {
  message: string;
  data: null;
}

export const logout = async (): Promise<void> => {
  try {
    if (localStorage.getItem('isAuthenticated') !== 'true') {
      throw new Error('로그인이 필요합니다.');
    }

    // 인증 쿠키는 서버가 만료시킨다.
    await axios.post<ApiResponse>(
      `${BASE_URL}/user/logout`,
      {},  // empty body
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    // 옛 버전이 남긴 토큰 잔재 청소
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // 리덕스 스토어 초기화 (옵션)
    // store.dispatch(clearUserInfo());
    // store.dispatch(logout());

  } catch (error: any) {
    console.error('로그아웃 에러:', error);
    console.error('에러 메시지:', error.response?.data?.message || '로그아웃 중 오류가 발생했습니다.');
    
    // 에러가 발생하더라도 로컬의 토큰은 제거
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    throw new Error(error.response?.data?.message || '로그아웃 중 오류가 발생했습니다.');
  }
}; 