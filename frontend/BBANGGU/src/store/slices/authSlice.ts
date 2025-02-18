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
  accessToken: localStorage.getItem('accessToken') || null,
  userType: localStorage.getItem('userType') || null,
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true' || false,
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
    getLocalStorage: (state: AuthState) => {
      state.accessToken = localStorage.getItem('accessToken') || null;
      state.userType = localStorage.getItem('userType') || null;
      state.isAuthenticated = localStorage.getItem('isAuthenticated') === 'true' || false;
    },
    setLocalStorage: (state: AuthState, action: PayloadAction<AuthState>) => {
      localStorage.setItem('accessToken', action.payload.accessToken || '');
      localStorage.setItem('userType', action.payload.userType || '');
      localStorage.setItem('isAuthenticated', action.payload.isAuthenticated.toString());
      console.log(state);
    },
    removeLocalStorage: () => {
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