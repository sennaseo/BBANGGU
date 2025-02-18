import { profileEditApi } from "../../../api/user/mypage/profileedit/profileEditApi"
import { UserInfo } from "../../../store/user";

export const userProfileEditService = {
    updateUserProfile: async (updatedData: Partial<UserInfo>) => {
        try {
            const response = await profileEditApi.updateUserProfile(updatedData);
            console.log("response", response);
            return response.data;
        } catch (error) {
            console.error('유저 프로필 수정 실패:', error);
            throw error;
        }
    }
}