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

interface UpdateSettlementRequest {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  emailForTaxInvoice: string;
  businessLicenseFileUrl?: string | null;
}

// 사장님 ID로 가게 조회
export const getBakeryByUserId = async (): Promise<BakeryInfo> => {
  const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzM5NTExOTE5LCJleHAiOjE3NDAxMTY3MTl9.1TANi8zQMdtN3uHUGbcuNunWJxWLZoZPoNZ3uePfiUM'; // 테스트용 토큰
  
  try {
    const response = await fetch('http://i12d102.p.ssafy.io:8081/user/bakery', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.code === 1013) {
        throw new Error('현재 로그인한 사용자는 사장님이 아닌 일반 사용자입니다.');
      }
      throw new Error(errorData.message || '가게 정보 조회에 실패했습니다.');
    }

    const responseData: ApiResponse<BakeryInfo> = await response.json();
    return responseData.data;
  } catch (error) {
    console.error('Error fetching bakery info:', error);
    throw error;
  }
};

// 가게 정보 수정
export const updateBakery = async (bakeryId: number, data: UpdateBakeryRequest): Promise<BakeryInfo> => {
  const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzM5NTExOTE5LCJleHAiOjE3NDAxMTY3MTl9.1TANi8zQMdtN3uHUGbcuNunWJxWLZoZPoNZ3uePfiUM'; // 테스트용 토큰
  
  try {
    const response = await fetch(`http://i12d102.p.ssafy.io:8081/bakery/${bakeryId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.code === 2002) {
        throw new Error('가게를 찾을 수 없습니다.');
      }
      if (errorData.code === 2001) {
        throw new Error('이미 존재하는 가게 이름입니다.');
      }
      throw new Error(errorData.message || '가게 정보 수정에 실패했습니다.');
    }

    const responseData: ApiResponse<BakeryInfo> = await response.json();
    return responseData.data;
  } catch (error) {
    console.error('Error updating bakery:', error);
    throw error;
  }
};

// 정산 정보 조회
export const getSettlementInfo = async (bakeryId: number): Promise<SettlementInfo> => {
  const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzM5NTExOTE5LCJleHAiOjE3NDAxMTY3MTl9.1TANi8zQMdtN3uHUGbcuNunWJxWLZoZPoNZ3uePfiUM'; // 테스트용 토큰
  
  try {
    const response = await fetch(`http://i12d102.p.ssafy.io:8081/bakery/${bakeryId}/settlement`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.code === 1011) {
        throw new Error('토큰이 없거나, 인증되지 않은 사용자입니다.');
      }
      if (errorData.code === 2005) {
        throw new Error('해당 가게의 정산정보가 존재하지 않습니다.');
      }
      throw new Error(errorData.message || '정산 정보 조회에 실패했습니다.');
    }

    const responseData: ApiResponse<SettlementInfo> = await response.json();
    return responseData.data;
  } catch (error) {
    console.error('Error fetching settlement info:', error);
    throw error;
  }
};

// 정산 정보 등록
export const createSettlement = async (data: CreateSettlementRequest): Promise<SettlementInfo> => {
  const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzM5NTExOTE5LCJleHAiOjE3NDAxMTY3MTl9.1TANi8zQMdtN3uHUGbcuNunWJxWLZoZPoNZ3uePfiUM'; // 테스트용 토큰
  
  try {
    const response = await fetch('http://i12d102.p.ssafy.io:8081/bakery/settlement', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.code === 400) {
        throw new Error('잘못된 형식의 요청입니다.');
      }
      throw new Error(errorData.message || '정산 정보 등록에 실패했습니다.');
    }

    const responseData: ApiResponse<SettlementInfo> = await response.json();
    return responseData.data;
  } catch (error) {
    console.error('Error creating settlement:', error);
    throw error;
  }
};

// 정산 정보 수정 API 추가
export const updateSettlement = async (bakeryId: number, data: UpdateSettlementRequest): Promise<void> => {
  const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzM5NTExOTE5LCJleHAiOjE3NDAxMTY3MTl9.1TANi8zQMdtN3uHUGbcuNunWJxWLZoZPoNZ3uePfiUM';
  
  try {
    const response = await fetch(`http://i12d102.p.ssafy.io:8081/bakery/${bakeryId}/settlement`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '정산 정보 수정에 실패했습니다.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating settlement info:', error);
    throw error;
  }
};
