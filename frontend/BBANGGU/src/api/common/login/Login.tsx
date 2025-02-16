import axios from 'axios';
import instance from '../../axios';

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

export const login = async (loginData: LoginRequest): Promise<LoginResponse> => {
  try {
    const requestData = {
      email: loginData.email.trim(),
      password: loginData.password
    };

    const response = await instance.post<LoginResponse>(
      '/user/login',
      requestData,
      {
        withCredentials: true,
      }
    );

    // axios 인스턴스의 기본 헤더에 토큰 설정
    if (response.data.data.access_token) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.access_token}`;
      localStorage.setItem('access_token', response.data.data.access_token);
      localStorage.setItem('refresh_token', response.data.data.refresh_token);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('Error Response:', error.response); // 전체 에러 응답 확인
      const errorData = error.response?.data;
      
      if (error.response?.status === 403) {
        throw new Error('접근이 거부되었습니다. 권한을 확인해주세요.');
      }
      
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