import axios from 'axios';
import instance from '../../axios';
import { loginSuccess, setLocalStorage } from '../../../store/slices/authSlice';
import { Dispatch } from '@reduxjs/toolkit';


interface LoginRequest {
  email: string;
  password: string;
}

export const login = async (loginData: LoginRequest, dispatch: Dispatch): Promise<void> => {
  try {
    const requestData = {
      email: loginData.email.trim(),
      password: loginData.password
    };

    const response = await instance.post(
      '/user/login',
      requestData,
      {
        withCredentials: true, // 쿠키 포함
      }
    );

    // accessToken 은 httpOnly 쿠키로 내려온다. body 에는 user_type 만 있다.
    const userType: string = response.data.data.user_type;

    dispatch(loginSuccess({ data: { user_type: userType } }));
    dispatch(setLocalStorage({ userType, isAuthenticated: true }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data;

      if (error.response?.status === 403) {
        throw new Error('접근이 거부되었습니다. 권한을 확인해주세요.');
      }

      switch (errorData?.code) {
        case 1000:
          throw new Error('잘못된 요청입니다.');
        case 1001:
          throw new Error('해당 사용자를 찾을 수 없습니다.');
        case 1002:
          throw new Error('비밀번호가 올바르지 않습니다.');
        default:
          throw new Error('로그인 중 오류가 발생했습니다.');
      }
    }
    throw new Error('로그인 중 오류가 발생했습니다.');
  }
};
