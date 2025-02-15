import instance from '../axios_2';
import { ApiResponse } from '../../types/api';

interface BakeryInfo {
  bakeryId: number;
  userId: number;
  name: string;
  description: string;
  businessRegistrationNumber: string;
  addressRoad: string;
  addressDetail: string;
  bakeryImageUrl: string | null;
  bakeryBackgroundImgUrl: string | null;
  star: number;
  reviewCnt: number;
}

interface UpdateBakeryRequest {
  name?: string;
  description?: string;
  addressRoad?: string;
  addressDetail?: string;
  photoUrl?: string;
}

interface SettlementInfo {
  settlementId: number;
  userId: number;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  emailForTaxInvoice: string;
  businessLicenseFileUrl: string | null;
}

interface CreateSettlementRequest {
  userId: number;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  emailForTaxInvoice: string;
  businessLicenseFileUrl?: string;
}

// 사장님 ID로 가게 조회
export const getBakeryByUserId = async (): Promise<BakeryInfo> => {
  try {
    const response = await instance.get('/user/bakery');
    const responseData: ApiResponse<BakeryInfo> = response.data;
    return responseData.data;
  } catch (error) {
    console.error('Error fetching bakery info:', error);
    throw error;
  }
};

// 가게 정보 수정
export const updateBakery = async (bakeryId: number, data: UpdateBakeryRequest): Promise<BakeryInfo> => {
  try {
    const response = await instance.put(`/bakery/${bakeryId}`, data);
    const responseData: ApiResponse<BakeryInfo> = response.data;
    return responseData.data;
  } catch (error) {
    console.error('Error updating bakery:', error);
    throw error;
  }
};

// 정산 정보 조회
export const getSettlementInfo = async (bakeryId: number): Promise<SettlementInfo> => {
  try {
    const response = await instance.get(`/bakery/${bakeryId}/settlement`);
    const responseData: ApiResponse<SettlementInfo> = response.data;
    return responseData.data;
  } catch (error) {
    console.error('Error fetching settlement info:', error);
    throw error;
  }
};

// 정산 정보 등록
export const updateSettlement = async (data: CreateSettlementRequest): Promise<SettlementInfo> => {
  try {
    const response = await instance.post('/bakery/update/settlement', data);
    const responseData: ApiResponse<SettlementInfo> = response.data;
    return responseData.data;
  } catch (error) {
    console.error('Error updating settlement:', error);
    throw error;
  }
};

// // 정산 정보 수정
// export const updateSettlement = async (request: SettlementUpdateRequest): Promise<null> => {
//   try {
//     const response = await instance.post('/bakery/update/settlement', request);
//     const responseData: ApiResponse<null> = response.data;
//     return responseData.data;
//   } catch (error: any) {
//     if (error.response) {
//       if (error.response.data.code === 2309) {
//         throw new Error('현재 로그인한 사용자는 해당 빵집의 사장님이 아닙니다.');
//       }
//       if (error.response.data.code === 2005) {
//         throw new Error('해당 가게의 정산정보가 존재하지 않습니다.');
//       }
//     }
//     console.error('정산 정보 수정 중 오류 발생:', error);
//     throw error;
//   }
// };
