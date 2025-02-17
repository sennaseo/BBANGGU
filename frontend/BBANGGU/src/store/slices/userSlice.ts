import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from '../../types/user';

interface UserState {
  userInfo: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
}

// localStorage에서 초기 상태 가져오기
const initialState: UserState = {
  userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null'),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token')
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<any>) => {
      state.userInfo = action.payload;
      // localStorage에도 저장
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      // localStorage에도 저장
      localStorage.setItem('token', action.payload);
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
      state.token = null;
      state.isAuthenticated = false;
      // localStorage에서도 제거
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
    }
  }
});

export const { setUserInfo, setToken, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;