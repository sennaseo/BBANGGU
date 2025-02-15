import axios from 'axios';
import { UserResponse } from '../../../types/user';

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://i12d102.p.ssafy.io:8081';

export const getUserInfo = async () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('토큰이 없습니다.');
    }

    const response = await axios.get<UserResponse>(
      `${BASE_URL}/user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error('접근 권한이 없습니다.');
      }
    }
    throw new Error('사용자 정보를 가져오는데 실패했습니다.');
  }
};