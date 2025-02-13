import axiosInstance from '../axios';

interface BreadRegisterRequest {
  bakeryId: number;
  breadCategoryId: number;
  name: string;
  price: number;
}

interface BreadRegisterResponse {
  message: string;
  data: {
    breadId: number;
  };
}

interface BreadInfo {
  breadId: number;
  bakeryId: number;
  breadCategoryId: number;
  name: string;
  price: number;
  breadImageUrl: string | null;
  breadImageBase64?: string | null; // Base64 이미지 데이터
}

interface BakeryBreadsResponse {
  message: string;
  data: BreadInfo[];
}

interface BreadUpdateRequest {
  bakeryId: number;
  breadCategoryId: number;
  name: string;
  price: number;
  breadImageUrl?: string | null;
}

interface BreadUpdateResponse {
  message: string;
  data: {
    breadId: number;
  };
}

interface BreadDeleteResponse {
  message: string;
  data: null;
}

export const registerBread = async (
  breadData: BreadRegisterRequest,
  breadImage?: File
): Promise<BreadRegisterResponse> => {
  try {
    const formData = new FormData();
    
    // bread 필드에 JSON 데이터를 문자열로 추가
    formData.append('bread', JSON.stringify(breadData));

    if (breadImage) {
      formData.append('breadImage', breadImage);
    }

    // 전송 데이터 로깅
    console.log('=== 전송 데이터 ===');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    const response = await axiosInstance.post<BreadRegisterResponse>('/bread', formData, {
      headers: {
        // Content-Type을 명시적으로 설정하지 않음 (axios가 자동으로 설정하도록)
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('=== 에러 상세 정보 ===');
    if (error.response) {
      console.error('에러 상태:', error.response.status);
      console.error('에러 데이터:', error.response.data);
      console.error('요청 헤더:', error.config?.headers);
    }
    throw new Error(error.response?.data?.message || '빵 등록에 실패했습니다.');
  }
};

export const getBakeryBreads = async (bakeryId: number): Promise<BreadInfo[]> => {
  try {
    const response = await axiosInstance.get<BreadInfo[]>(`/bread/bakery/${bakeryId}`);
    return response.data;
  } catch (error: any) {
    console.error('=== 가게 빵 목록 조회 실패 ===');
    if (error.response) {
      console.error('에러 상태:', error.response.status);
      console.error('에러 데이터:', error.response.data);
    }
    throw new Error(error.response?.data?.message || '가게 빵 목록 조회에 실패했습니다.');
  }
};

// 빵 정보 수정 API
export const updateBread = async (
  breadId: number,
  breadData: BreadUpdateRequest,
  breadImage?: File
): Promise<BreadUpdateResponse> => {
  try {
    const formData = new FormData();
    
    // bread 필드에 JSON 데이터를 문자열로 추가
    formData.append('bread', JSON.stringify(breadData));

    if (breadImage) {
      formData.append('breadImage', breadImage);
      // 이미지가 변경되면 breadImageUrl을 null로 설정
      breadData.breadImageUrl = null;
    }

    const response = await axiosInstance.put<BreadUpdateResponse>(`/bread/${breadId}`, formData, {
      headers: {
        // Content-Type을 명시적으로 설정하지 않음 (axios가 자동으로 설정하도록)
      }
    });

    return response.data;
  } catch (error: any) {
    console.error('=== 빵 정보 수정 실패 ===');
    if (error.response) {
      console.error('에러 상태:', error.response.status);
      console.error('에러 데이터:', error.response.data);
    }
    throw new Error(error.response?.data?.message || '빵 정보 수정에 실패했습니다.');
  }
};

// 빵 정보 삭제 API
export const deleteBread = async (breadId: number): Promise<BreadDeleteResponse> => {
  try {
    const response = await axiosInstance.delete<BreadDeleteResponse>(`/bread/${breadId}`);
    return response.data;
  } catch (error: any) {
    console.error('=== 빵 정보 삭제 실패 ===');
    if (error.response) {
      console.error('에러 상태:', error.response.status);
      console.error('에러 데이터:', error.response.data);
    }
    throw new Error(error.response?.data?.message || '빵 정보 삭제에 실패했습니다.');
  }
}; 