import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInfo } from '../../api/user/user';

export interface UserState {
  id: string;
  userInfo: UserInfo | null;
}

// ✅ localStorage에서 `userInfo` 복원
const storedUserInfo = localStorage.getItem('userInfo');
const initialState: UserState = {
  id: '',
  userInfo: storedUserInfo ? JSON.parse(storedUserInfo) : null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      console.log('Setting user info:', action.payload);
      state.userInfo = action.payload;

      // ✅ localStorage에 저장 (새로고침 대비)
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    fetchUserInfo: (state, action: PayloadAction<UserInfo>) => { 
      state.userInfo = action.payload;
      
      // ✅ localStorage 업데이트
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
      
      // ✅ localStorage에서 삭제
      localStorage.removeItem('userInfo');
    },
    setBakeryId: (state, action: PayloadAction<number>) => {
      if (state.userInfo) {
        state.userInfo.bakeryId = action.payload;

        // ✅ 변경된 `userInfo`를 다시 localStorage에 저장
        localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
      }
    }
  }
});

export const { setUserInfo, setReservationCount, clearUserInfo, fetchUserInfo, setBakeryId } = userSlice.actions;
export default userSlice.reducer;
