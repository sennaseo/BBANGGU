export interface UserInfo {
  userId: number;
  bakeryId: number | null;
  name: string;
  email: string;
  phone: string;
  role: 'OWNER' | 'USER';
  profileImageUrl: string | null;
  addressRoad: string | null;
  addressDetail: string | null;
}

export interface UserState {
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface UserResponse {
  message: string;
  data: UserInfo;
}