import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://i12d102.p.ssafy.io:8081',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000,
  timeoutErrorMessage: '네트워크 연결에 실패했습니다'
});

export const AuthApi = {
  // 이메일 인증 요청
  sendEmailVerification: async (email: string) => {
    try {
      const response = await api.post('/auth/email/send', { email });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // 이메일 인증 확인
  verifyEmail: async (email: string, authCode: string) => {
    try {
      const response = await api.post('/auth/email/verify', { email, authCode });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // 토큰 재발급
  refreshToken: async () => {
    try {
      const response = await api.post('/auth/token/refresh');
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // 회원가입
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'USER' | 'OWNER';
  }) => {
    try {
      const registerData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        userType: userData.role
      };
      
      console.log('Final register data:', registerData);
      
      const response = await api.post('/user/register', registerData);
      return response.data;
    } catch (error: any) {
      console.error('Register error details:', error.response?.data);
      throw error.response?.data || error;
    }
  }
};