import { api, AuthApi } from '../../../api/common/signup/AuthApi';

export const OwnerApi = {
  ...AuthApi,
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    return AuthApi.register({
      ...userData,
      role: 'OWNER'
    });
  },

  // 가게 정보 등록
  registerStore: async (storeData: {
    userId: number;
    name: string;
    description: string;
    businessRegistrationNumber: string;
    addressRoad: string;
    addressDetail: string;
    bakeryImageUrl: string;
    bakryBackgroundImgUrl?: string;  // 선택적
  }) => {
    try {
      const response = await api.post('/bakery', storeData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  // 가게 정산 정보 등록
  registerSettlement: async (settlementData: {
    userId: number;
    bankName: string;
    accountHolderName: string;
    accountNumber: string;
    emailForTaxInvoice: string;
    businessLicenseFileUrl: string;
  }) => {
    try {
      const response = await api.post('/bakery/settlement', settlementData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
};