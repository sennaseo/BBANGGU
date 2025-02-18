import { store } from '../../store';
import { fetchUserInfo } from '../../store/slices/userSlice';
import { ApiResponse } from '../../types/api';
import instance from '../axios';

export interface UserInfo {
  userId: number;
  bakeryId: number | null;
  name: string;
  email: string;
  phone: string;
  role: string;
  profileImageUrl: string | null;
  addressRoad: string | null;
  addressDetail: string | null;
}

// interface UpdateUserRequest {
//   name?: string;
//   phone?: string;
//   addressRoad?: string;
//   addressDetail?: string;
// }

// interface UpdateUserResponse {
//   message: string;
//   data: null;
// }

interface UpdatePasswordRequest {
  originPassword: string;
  newPassword: string;
}

interface UpdatePasswordResponse {
  message: string;
  data: null;
}

export const getUserInfo = async (): Promise<UserInfo> => {
  try {
    const response = await instance.get<ApiResponse<UserInfo>>('/user');
    store.dispatch(fetchUserInfo(response.data.data));
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

interface UpdateUserProfileData {
  name?: string;
  email?: string;
  phone?: string;
  // 필요한 다른 필드를 추가합니다.
}

export const profileEditApi = {
  updateUserProfile: async (formData: UpdateUserProfileData, profileImage?: File): Promise<ApiResponse<UserInfo[]>> => {
      try {
          const token = store.getState().auth.accessToken;
          const multipartData = new FormData();

          multipartData.append("user", new Blob([JSON.stringify(formData)], { type: "application/json" }));

          if (profileImage) {
              multipartData.append("profileImage", profileImage);
          }

          const response = await instance.patch<ApiResponse<UserInfo[]>>(
              `/user/update`,
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
};


// export const updateUserInfo = async (data: UpdateUserRequest): Promise<UpdateUserResponse> => {
//   try {
//     const response = await instance.patch<UpdateUserResponse>('/user/update', data);

//     if (!response.data) {
//       throw new Error('회원 정보 수정에 실패했습니다.');
//     }

//     return response.data;
//   } catch (error: any) {
//     if (error.response) {
//       if (error.response.status === 401) {
//         throw new Error('인증이 필요합니다.');
//       }
//       if (error.response.status === 409) {
//         throw new Error('이미 사용 중인 전화번호입니다.');
//       }
//       throw new Error(error.response.data.message || '회원 정보 수정에 실패했습니다.');
//     }
//     throw error;
//   }
// };

export const updatePassword = async (data: UpdatePasswordRequest): Promise<UpdatePasswordResponse> => {
  try {
    const response = await instance.post<UpdatePasswordResponse>('/user/update/password', data);

    if (!response.data) {
      throw new Error('비밀번호 변경에 실패했습니다.');
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.data.code === 1014) {
        throw new Error('입력한 기존 비밀번호가 현재 비밀번호와 일치하지 않습니다.');
      }
      if (error.response.data.code === 1015) {
        throw new Error('기존 비밀번호와 동일한 비밀번호로는 변경할 수 없습니다.');
      }
      throw new Error(error.response.data.message || '비밀번호 변경에 실패했습니다.');
    }
    throw error;
  }
}; 
