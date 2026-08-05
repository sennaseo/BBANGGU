import axios from 'axios';
import { ApiResponse } from '../../../../types/response';
import { store } from '../../../../store';
import { API_BASE_URL } from '../../../../config/env';

const BASE_URL = API_BASE_URL;

const profileEditApi = {
    updateUserProfile: async (formData: FormData): Promise<ApiResponse<null>> => {
        try {
            const token = store.getState().auth.accessToken;
            
            const response = await axios.patch<ApiResponse<null>>(
                `${BASE_URL}/user/update`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // Content-Type은 FormData가 자동으로 설정
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error("❌ 유저 프로필 수정 실패:", error);
            throw error;
        }
    },
};

export default profileEditApi;
