import axios from "axios";
import { UserType } from "../../../types/bakery";
import { ApiResponse } from "../../../types/api";
import { store } from "../../../store";

interface UpdateUserProfileData {
  name?: string;
  email?: string;
  phone?: string;
  // 필요한 다른 필드를 추가합니다.
}

export const profileEditApi = {
    updateUserProfile: async (formData: UpdateUserProfileData, profileImage?: File): Promise<ApiResponse<UserType[]>> => {
        try {
            const token = store.getState().auth.accessToken;

            const multipartData = new FormData();
            multipartData.append("user", JSON.stringify(formData));
            multipartData.append("profileImage", JSON.stringify(profileImage));
        
            if(profileImage) {
                multipartData.append("profileImage", profileImage)
            }

            const response = await axios.patch<ApiResponse<UserType[]>>(
                `${import.meta.env.VITE_API_BASE_URL}/user/update`,
                multipartData,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
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