import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState, UserInfo } from '../../types/user';

const initialState: UserState = {
  userInfo: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const { setUserInfo, setLoading, setError, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;