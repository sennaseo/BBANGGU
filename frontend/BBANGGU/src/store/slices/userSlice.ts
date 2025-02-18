import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from '../../api/user/user';

export interface UserState {
  id: string;
  userInfo: UserInfo | null;
  // isAuthenticated: boolean;
}

// localStorage에서 초기 상태 가져오기
const initialState: UserState = {
  id: '',
  userInfo: null,
  // isAuthenticated: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      console.log('Setting user info:', action.payload);
      state.userInfo = action.payload;
      // state.isAuthenticated = action.payload.accessToken ? true : false;
      // localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    fetchUserInfo: (state, action: PayloadAction<UserInfo>) => { 
      state.userInfo = action.payload;
      // state.isAuthenticated = store.getState().auth.isAuthenticated;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
      // state.isAuthenticated = false;
      // localStorage.removeItem('userInfo');
      // accessToken은 authSlice에서 관리하므로 여기서는 제거하지 않음
    }
  }
});

export const { setUserInfo, clearUserInfo, fetchUserInfo } = userSlice.actions;
export default userSlice.reducer;