import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://i12d102.p.ssafy.io:8081';

interface ApiResponse {
  message: string;
  data: null;
}

export const logout = async (): Promise<void> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      throw new Error('로그인이 필요합니다.');
    }

    console.log('로그아웃 요청:', {
      url: `${BASE_URL}/user/logout`,
      token: accessToken.substring(0, 10) + '...'
    });

    await axios.post<ApiResponse>(
      `${BASE_URL}/user/logout`,
      {},  // empty body
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      }
    );

    // 로컬 스토리지의 토큰 제거
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