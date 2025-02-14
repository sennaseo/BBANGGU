import axios from 'axios';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    user_type: "OWNER" | "USER";
  };
}

interface LoginErrorResponse {
  code: number;
  status: string;
  message: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://i12d102.p.ssafy.io:8081';

export const login = async (loginData: LoginRequest): Promise<LoginResponse> => {
  try {
    const url = `${BASE_URL}/user/login`;
    
    const requestData = {
      email: loginData.email.trim(),
      password: loginData.password
    };

    const response = await axios.post<LoginResponse>(
      url,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: true,
      }
    );

    // 로그인 성공 시 토큰 저장
    if (response.data.data.access_token) {
      localStorage.setItem('access_token', response.data.data.access_token);
      localStorage.setItem('refresh_token', response.data.data.refresh_token);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data;
      
      switch (errorData?.code) {
        case 1000:
          throw new Error('잘못된 요청입니다.');
        case 1001:
          throw new Error('해당 사용자를 찾을 수 없습니다.');
        case 1002:
          throw new Error('비밀번호가 올바르지 않습니다.');
        default:
          throw new Error('로그인 중 오류가 발생했습니다.');
      }
    }
    throw new Error('로그인 중 오류가 발생했습니다.');
  }
};