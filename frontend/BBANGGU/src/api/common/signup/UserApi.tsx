import { AuthApi } from '../../../api/common/signup/AuthApi';

export const UserApi = {
  ...AuthApi,
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    return AuthApi.register({
      ...userData,
      role: 'USER'
    });
  }
};