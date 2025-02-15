import axios from 'axios';
import { ApiResponse } from '../../types/api';

interface UserInfo {
  userId: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  profilebakeryImageUrl: string | null;
}

export const getUserInfo = async (userId: number): Promise<UserInfo> => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }

    const response = await axios.get<ApiResponse<UserInfo>>(`/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    console.log('토큰 확인:', token); // 토큰 값 확인
    console.log('API 요청 헤더:', {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }); // 요청 헤더 확인
    console.log('API Response:', response.data); // 기존 응답 확인
    console.log('사용자 정보:', response.data.data); // 파싱된 사용자 정보 확인

    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }

    return response.data.data;
  } catch (error) {
    console.error('API Error details:', error); // 자세한 에러 정보 확인
    throw error;
  }
};
