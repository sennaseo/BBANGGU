import axios from 'axios';

interface LogoutResponse {
  message: string;
  data: null;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const logout = async (): Promise<LogoutResponse> => {
  try {
    const token = localStorage.getItem('access_token');
    console.log('로그아웃 시도 - 토큰:', token);
    console.log('요청 URL:', `${BASE_URL}/user/logout`);

    const response = await axios.post(`${BASE_URL}/user/logout`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('로그아웃 응답:', response.data);
    
    // 로컬 스토리지 토큰 삭제
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    console.log('로컬 스토리지 토큰 삭제 완료');

    return response.data;
  } catch (error) {
    console.error('로그아웃 에러:', error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || '로그아웃 중 오류가 발생했습니다.';
      console.log('에러 메시지:', errorMessage);
      throw new Error(errorMessage);
    }
    throw new Error('로그아웃 중 오류가 발생했습니다.');
  }
}; 