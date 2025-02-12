import axios from 'axios';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  data: "OWNER" | "USER" | null;
}

interface LoginErrorResponse {
  code: number;
  status: string;
  message: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://i12d102.p.ssafy.io:8081';

export const login = async (loginData: LoginRequest): Promise<LoginResponse> => {
  try {
    console.log('API 요청 데이터:', loginData);
    const url = `${BASE_URL}/user/login`;
    console.log('요청 URL:', url);

    // 요청 데이터 형식 확인
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
        timeout: 10000, // 10초 타임아웃 설정
      }
    );

    console.log('API 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('API 에러:', error);
    if (axios.isAxiosError(error)) {
      console.error('상세 에러 정보:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });

      // 서버 에러(500) 처리
      if (error.response?.status === 500) {
        throw new Error('서버와의 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }

      const errorData = error.response?.data as LoginErrorResponse;
      throw new Error(errorData.message || '로그인에 실패했습니다.');
    }
    throw new Error('로그인 중 오류가 발생했습니다.');
  }
};