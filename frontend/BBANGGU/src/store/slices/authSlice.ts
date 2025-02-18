import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  userType: string | null;
  isAuthenticated: boolean;
}

interface LoginResponse {
  data: {
    access_token: string;
    user_type: string;
  };
}

const initialState: AuthState = {
  accessToken: "",
  userType: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
      const { access_token, user_type } = action.payload.data;
      state.accessToken = access_token;
      state.userType = user_type;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.accessToken = null;
      state.userType = null;
      state.isAuthenticated = false;
    },
  },
});

// 선택자 추가
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectUserType = (state: { auth: AuthState }) => state.auth.userType;

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;