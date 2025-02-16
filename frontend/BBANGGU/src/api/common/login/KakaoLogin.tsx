import instance from '../../../api/axios';

interface KakaoLoginResponse {
  message: string;
  data: string;
}

interface KakaoCallbackResponse {
  message: string;
  data: {
    user: {
      id: number;
      email: string;
      nickname: string;
      // 기타 필요한 사용자 정보 필드
    };
  };
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

export const handleKakaoCallback = async (code: string): Promise<KakaoCallbackResponse> => {
  try {
    const response = await instance.get<KakaoCallbackResponse>(
      `/oauth/kakao/callback?code=${code}`,
      {
        withCredentials: true,
      }
    );
    console.log('Kakao Callback Response:', response);
    
    // Authorization 헤더에서 액세스 토큰 저장
    const accessToken = response.headers.authorization;
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    
    return response.data;
  } catch (error: unknown) {
    console.error('Kakao Callback Error:', error);
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || '카카오 로그인 처리에 실패했습니다.';
      throw new Error(errorMessage);
    }
    throw new Error('카카오 로그인 처리 중 오류가 발생했습니다.');
  }
};