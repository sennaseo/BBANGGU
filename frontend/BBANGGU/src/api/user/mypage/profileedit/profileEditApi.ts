import axios from 'axios';
import { ApiResponse } from '../../../../types/response';
import type { UserInfo } from '../../../../store/user';
import { store } from '../../../../store';

// const BASE_URL = 'http://127.0.0.1:8080';
// const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://13.124.56.79:8081';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const profileEditApi = {
    updateUserProfile: async (formData: UserInfo): Promise<ApiResponse<UserInfo[]>> => {
        try {
            const token = store.getState().auth.accessToken;
            const response = await axios.patch<ApiResponse<UserInfo[]>>(
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