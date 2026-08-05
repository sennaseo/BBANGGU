import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userType: string | null;
  isAuthenticated: boolean;
}

interface LoginResponse {
  data: {
    user_type: string;
  };
}

// 인증 토큰은 httpOnly 쿠키에만 있다. 옛 버전이 localStorage 에 남긴 토큰은 청소한다.
localStorage.removeItem('accessToken');

const initialState: AuthState = {
  userType: localStorage.getItem('userType') || null,
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true' || false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
      state.userType = action.payload.data.user_type;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.userType = null;
      state.isAuthenticated = false;
    },
    getLocalStorage: (state: AuthState) => {
      state.userType = localStorage.getItem('userType') || null;
      state.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true' || false;
    },
    setLocalStorage: (_state: AuthState, action: PayloadAction<AuthState>) => {
      localStorage.setItem('userType', action.payload.userType || '');
      localStorage.setItem('isAuthenticated', action.payload.isAuthenticated.toString());
    },
    removeLocalStorage: () => {
      // 'accessToken' 은 옛 버전 잔재 청소용
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userType');
      localStorage.removeItem('isAuthenticated');
    },  
  },
});

// 선택자 추가
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectUserType = (state: { auth: AuthState }) => state.auth.userType;

export const { loginSuccess, logout, setLocalStorage, removeLocalStorage, getLocalStorage } = authSlice.actions;
export default authSlice.reducer;