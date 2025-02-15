import { profileEditApi } from "../../../api/user/mypage/profileedit/profileEditApi"
import type { UserType } from "../../../types/bakery"

export const userProfileEditService = {
    updateUserProfile: async (updatedData: Partial<UserType>) => {
        try {
            const response = await profileEditApi.updateUserProfile(updatedData);
            return response.data;
        } catch (error) {
            console.error('유저 프로필 수정 실패:', error);
            throw error;
        }
    }
}