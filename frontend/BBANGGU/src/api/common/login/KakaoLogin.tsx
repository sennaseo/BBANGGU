import axios from 'axios';

interface KakaoLoginResponse {
  message: string;
  data: string;
}

interface KakaoCallbackResponse {
  message: string;
  data: null;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://i12d102.p.ssafy.io:8081';

export const getKakaoLoginUrl = async (): Promise<KakaoLoginResponse> => {
  try {
    const response = await axios.get<KakaoLoginResponse>(
      `${BASE_URL}/auth/kakao/login`,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    );
    
    console.log('Kakao Login Response:', response); // 디버깅용
    return response.data;
  } catch (error) {
    console.error('Kakao Login Error:', error); // 디버깅용
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || '카카오 로그인 URL 생성에 실패했습니다.';
      throw new Error(errorMessage);
    }
    throw new Error('카카오 로그인 URL 생성 중 오류가 발생했습니다.');
  }
};