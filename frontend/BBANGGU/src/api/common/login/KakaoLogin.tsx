import instance from '../../../api/axios';

interface KakaoLoginResponse {
  message: string;
  data: string;
}

export const getKakaoLoginUrl = async (): Promise<KakaoLoginResponse> => {
  try {
    const response = await instance.get<KakaoLoginResponse>(
      `/oauth/kakao/login`,
      {
        withCredentials: true,
      }
    );
    console.log('Kakao Login Response:', response); // 디버깅용
    return response.data;
  } catch (error: unknown) {
    console.error('Kakao Login Error:', error); // 디버깅용
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || '카카오 로그인 URL 생성에 실패했습니다.';
      throw new Error(errorMessage);
    }
    throw new Error('카카오 로그인 URL 생성 중 오류가 발생했습니다.');
  }
};