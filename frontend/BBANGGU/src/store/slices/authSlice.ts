import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginResponse } from '../../types/auth';

const initialState: AuthState = {
  isAuthenticated: false,
  userType: null,
  accessToken: null,
  refreshToken: null,
  message: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
      state.isAuthenticated = true;
      state.userType = action.payload.data.user_type;
      state.accessToken = action.payload.data.access_token;
      state.refreshToken = action.payload.data.refresh_token;
      state.message = action.payload.message;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userType = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.message = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;