import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from '../../api/user/user';

export interface UserState {
  id: string;
  userInfo: UserInfo | null;
}

// localStorage에서 초기 상태 가져오기
const initialState: UserState = {
  id: '',
  userInfo: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      console.log('Setting user info:', action.payload);
      state.userInfo = action.payload;
    },
    fetchUserInfo: (state, action: PayloadAction<UserInfo>) => { 
      state.userInfo = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
    },
    setBakeryId: (state, action: PayloadAction<number>) => {
      if (state.userInfo) {
        state.userInfo.bakeryId = action.payload;
      }
    }
  }
});

export const { setUserInfo, clearUserInfo, fetchUserInfo, setBakeryId } = userSlice.actions;
export default userSlice.reducer;