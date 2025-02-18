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

interface UpdateUserRequest {
  name?: string;
  phone?: string;
  addressRoad?: string;
  addressDetail?: string;
  profileImageUrl?: File | null;
}

interface UpdateUserResponse {
  message: string;
  data: null;
}

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

export const updateUserInfo = async (data: UpdateUserRequest): Promise<UpdateUserResponse> => {
  try {
    console.log(data);
    const multipartData = new FormData();
    multipartData.append("updates", JSON.stringify(({ updates: data })));

    if(data.profileImageUrl) {
      multipartData.append("profileImage", data.profileImageUrl)
    }
    const response = await instance.patch<UpdateUserResponse>('/user/update', multipartData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

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
