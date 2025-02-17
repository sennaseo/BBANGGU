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
  token: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken') // accessToken을 기준으로 변경
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<any>) => {
      state.userInfo = action.payload;
      state.isAuthenticated = !!localStorage.getItem('accessToken'); // accessToken 존재 여부로 인증 상태 설정
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
      localStorage.removeItem('userInfo');
      // accessToken은 authSlice에서 관리하므로 여기서는 제거하지 않음
    }
  }
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;