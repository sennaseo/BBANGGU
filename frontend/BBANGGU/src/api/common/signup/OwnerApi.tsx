import { api, AuthApi } from '../../../api/common/signup/AuthApi';

export const OwnerApi = {
  ...AuthApi,
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
  }) => {
    return AuthApi.register({
      ...userData,
      role: 'OWNER'
    });
  },

  // 가게 정보 등록 (Owner 전용)
  registerStore: async (storeData: {
    name: string;
    description: string;
    businessRegistrationNumber: string;
    addressRoad: string;
    addressDetail: string;
    photoUrl: string;
    userId: number;
  }) => {
    try {
      const response = await api.post('/bakery', storeData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
};