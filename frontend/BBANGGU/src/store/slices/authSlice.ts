import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userType: string | null;
  isAuthenticated: boolean;
}

interface LoginResponse {
  data: {
    access_token: string;
    refresh_token: string;
    user_type: string;
  };
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  userType: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
      const { access_token, refresh_token, user_type } = action.payload.data;
      state.accessToken = access_token;
      state.refreshToken = refresh_token;
      state.userType = user_type;
      state.isAuthenticated = true;
      
      // localStorage에도 저장
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.userType = null;
      state.isAuthenticated = false;
      
      // localStorage에서도 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
});

// 선택자 추가
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectUserType = (state: { auth: AuthState }) => state.auth.userType;

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;