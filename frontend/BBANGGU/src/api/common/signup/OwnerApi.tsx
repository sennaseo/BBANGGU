import { AuthApi } from '../../../api/common/signup/AuthApi';
import instance from '../../axios';
import { BakeryInfo } from '../../owner/bakery';

export interface SettlementData {
  userId: number;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  emailForTaxInvoice: string;
  businessLicenseFileUrl: string | File; // 🔹 URL(문자열) 또는 File 객체 가능
}


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


  // 가게 정보 등록 (multipart/form-data 전송)
  registerStore: async (storeData: {
    userId: number;
    name: string;
    description: string;
    businessRegistrationNumber: string;
    addressRoad: string;
    addressDetail: string;
    bakeryImage?: File; // 가게 이미지 파일
    bakeryBackgroundImage?: File; // 가게 배경 이미지 파일
  }): Promise<BakeryInfo> => {
    try {
      const formData = new FormData();

      // 📌 JSON 데이터를 'bakery' 키로 추가 (백엔드 명세에 맞춤)
      const bakeryInfo = {
        userId: storeData.userId,
        name: storeData.name,
        description: storeData.description,
        businessRegistrationNumber: storeData.businessRegistrationNumber,
        addressRoad: storeData.addressRoad,
        addressDetail: storeData.addressDetail,
      };
      formData.append("bakery", new Blob([JSON.stringify(bakeryInfo)], { type: "application/json" }));

      // 📌 가게 프로필 이미지 추가 (파일이 있을 경우에만)
      if (storeData.bakeryImage) {
        formData.append("bakeryImage", storeData.bakeryImage);
      }

      // 📌 가게 배경 이미지 추가 (파일이 있을 경우에만)
      if (storeData.bakeryBackgroundImage) {
        formData.append("bakeryBackgroundImage", storeData.bakeryBackgroundImage);
      }

      // 📌 API 요청 (headers에서 "Content-Type" 설정 제거 → Axios가 자동 설정)
      const response = await instance.post<BakeryInfo>(
        `/bakery`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Store registration error:", error.response?.data || error);
      throw error.response?.data || error;
    }
  },

  

  // 가게 정산 정보 등록
  registerSettlement: async (formData: FormData) => {
    try {
      // 📌 API 요청 (FormData 전송)
      const response = await instance.post<FormData>("/bakery/settlement", formData, {
        withCredentials: true,
      });
  
      return response.data;
    } catch (error: any) {
      console.error("Store registration error:", error.response?.data || error);
      throw error.response?.data || error;
    }
  },
  
}
