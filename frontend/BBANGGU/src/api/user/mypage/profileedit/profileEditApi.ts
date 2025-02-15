import axios from 'axios';
import { ApiResponse } from '../../../../types/response';
import type { UserType } from '../../../../types/bakery';

// const BASE_URL = 'http://127.0.0.1:8080';
// const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://13.124.56.79:8081';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface UpdateUserProfileData {
  name?: string;
  email?: string;
  phone?: string;
  // 필요한 다른 필드를 추가합니다.
}

export const profileEditApi = {
    updateUserProfile: async (formData: UpdateUserProfileData): Promise<ApiResponse<UserType[]>> => {
        try {
            const token = localStorage.getItem("accessToken") || import.meta.env.VITE_MOCK_ACCESS_TOKEN || "";
            console.log("Authorization Token:", token);
            const response = await axios.patch<ApiResponse<UserType[]>>(
                `${BASE_URL}/user/update`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('유저 프로필 수정 실패:', error);
            throw error;
        }
    },
}