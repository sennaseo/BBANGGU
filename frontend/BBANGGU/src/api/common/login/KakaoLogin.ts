import instance from "../../axios";
import { AxiosResponse } from 'axios';

interface KakaoCallbackResponse {
  user: {
    userId: number;
    name: string;
    email: string;
    phone: string;
    role: 'USER' | 'OWNER';
    profileImageUrl: string | null;
    addressRoad: string | null;
    addressDetail: string | null;
  };
}

export const handleKakaoCallback = async (code: string): Promise<AxiosResponse<KakaoCallbackResponse>> => {
  return instance.get<KakaoCallbackResponse>(`/oauth/kakao/callback?code=${code}`);
};

export const getKakaoLoginUrl = async () => {
  const response = await instance.get<{ data: string }>('/oauth/kakao/login');
  return response;
}; 