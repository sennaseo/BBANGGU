import axios from 'axios';
import { API_BASE_URL } from '../../../config/env';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000,
  timeoutErrorMessage: '네트워크 연결에 실패했습니다'
});

interface PasswordResetResponse {
  message: string;
  data: null;
}

export const PasswordApi = {
  // 비밀번호 초기화 요청 (이메일 전송)
  requestReset: async (email: string): Promise<PasswordResetResponse> => {
    try {
      const response = await api.post("/user/password/reset", { email });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // 새 비밀번호로 변경
  confirmReset: async (email: string, newPassword: string): Promise<PasswordResetResponse> => {
    try {
      const response = await api.post("/user/password/reset/confirm", {
        email,
        newPassword
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
};