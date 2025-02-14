export interface AuthState {
    isAuthenticated: boolean;
    userType: 'OWNER' | 'USER' | null;
    accessToken: string | null;
    refreshToken: string | null;
    message: string | null;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    message: string;
    data: {
      access_token: string;
      refresh_token: string;
      user_type: "OWNER" | "USER";
    };
  }