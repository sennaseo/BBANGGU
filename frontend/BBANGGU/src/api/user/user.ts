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
    console.log('1. getUserInfo API 호출 시작');
    const userResponse = await instance.get<ApiResponse<UserInfo>>('/user');
    console.log('2. 사용자 정보 응답:', userResponse.data);
    
    // 사용자가 OWNER인 경우 베이커리 정보도 가져오기
    if (userResponse.data.data.role === 'OWNER') {
      try {
        console.log('3. OWNER 계정 확인됨, 베이커리 정보 조회 시작');
        const bakeryResponse = await instance.get<ApiResponse<any>>('/bakery');
        console.log('4. 베이커리 응답:', bakeryResponse.data);
        
        if (bakeryResponse.data.data) {
          console.log('5. 베이커리 데이터 존재함:', bakeryResponse.data.data);
          
          // 현재 사용자의 베이커리 찾기
          const userBakery = bakeryResponse.data.data.find(
            (bakery: any) => bakery.userId === userResponse.data.data.userId
          );
          
          console.log('5-1. 찾은 사용자의 베이커리:', userBakery);
          
          if (userBakery) {
            const userData = {
              ...userResponse.data.data,
              bakeryId: userBakery.bakeryId
            };
            console.log('6. 병합된 사용자 데이터:', userData);
            
            store.dispatch(fetchUserInfo(userData));
            console.log('7. Redux store 업데이트 완료');
            
            return userData;
          }
        }
      } catch (bakeryError) {
        console.error('베이커리 정보 조회 실패:', bakeryError);
      }
    }
    
    // 베이커리 정보가 없는 경우 기본 userInfo 반환
    const defaultUserData = {
      ...userResponse.data.data,
      bakeryId: null
    };
    console.log('8. 기본 사용자 데이터 반환:', defaultUserData);
    
    store.dispatch(fetchUserInfo(defaultUserData));
    return defaultUserData;
  } catch (error) {
    console.error('Error in getUserInfo API:', error);
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
    const response = await instance.post<UpdatePasswordResponse>('/user/update/password/reset/confirm', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

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
