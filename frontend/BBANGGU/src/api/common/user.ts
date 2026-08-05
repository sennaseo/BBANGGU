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

    if (!response.data || !response.data.data) {
      throw new Error('Invalid response format');
    }

    return response.data.data;
  } catch (error) {
    console.error('API Error details:', error); // 자세한 에러 정보 확인
    throw error;
  }
};
