import axios from 'axios';
import instance from '../../axios';

interface KakaoLoginResponse {
  message: string;
  data: string;
}

export const getKakaoLoginUrl = async (): Promise<KakaoLoginResponse> => {
  try {
    const response = await instance.get<KakaoLoginResponse>(
      '/oauth/kakao/login',
      {
        withCredentials: true,
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