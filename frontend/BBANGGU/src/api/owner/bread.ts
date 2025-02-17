import instance from '../axios';

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

export interface BreadInfo {
  breadId: number | null;  // null 허용
  bakeryId: number;
  breadCategoryId: number;
  name: string;
  price: number;
  breadImageUrl: string | null;
  breadImageBase64?: string | null; // Base64 이미지 데이터
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

interface ApiError extends Error {
  response?: {
    status: number;
    data: {
      message?: string;
    };
    config?: {
      headers: Record<string, string>;
    };
  };
}

export const registerBread = async (
  breadData: BreadRegisterRequest,
  breadImage?: File
): Promise<BreadRegisterResponse> => {
  try {
    const formData = new FormData();
    
    // bread 필드에 JSON 문자열로 직접 추가
    formData.append('bread', JSON.stringify({
      bakeryId: breadData.bakeryId,
      breadCategoryId: breadData.breadCategoryId,
      name: breadData.name,
      price: breadData.price
    }));

    // 이미지가 있으면 추가
    if (breadImage) {
      formData.append('breadImage', breadImage);
    }

    // FormData 내용 로깅 (타입 에러 해결)
    console.log('=== FormData 내용 ===');
    const requestData: Record<string, any> = {};
    formData.forEach((value, key) => {
      requestData[key] = value;
    });
    console.log(requestData);

    const response = await instance.post('/bread', formData);
    return response.data;
  } catch (error: any) {
    console.error('빵 등록 실패:', error);
    console.error('에러 상세:', error.response?.data);
    throw error;
  }
};

export const getBakeryBreads = async (bakeryId: number): Promise<BreadInfo[]> => {
  try {
    const response = await instance.get<BreadInfo[]>(`/bread/bakery/${bakeryId}`);
    console.log('빵 목록 조회 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('빵 목록 조회 실패:', error);
    throw error;
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
    
    // bread 필드에 JSON 문자열로 직접 추가
    formData.append('bread', JSON.stringify({
      bakeryId: breadData.bakeryId,
      breadCategoryId: breadData.breadCategoryId,
      name: breadData.name,
      price: breadData.price
    }));

    // 이미지가 있으면 추가
    if (breadImage) {
      formData.append('breadImage', breadImage);
    }

    // FormData 내용 로깅 (타입 에러 해결)
    console.log('=== FormData 내용 ===');
    const requestData: Record<string, any> = {};
    formData.forEach((value, key) => {
      requestData[key] = value;
    });
    console.log(requestData);

    const response = await instance.put(`/bread/${breadId}`, formData);
    return response.data;
  } catch (error: any) {
    console.error('빵 수정 실패:', error);
    console.error('에러 상세:', error.response?.data);
    throw error;
  }
};

// 빵 정보 삭제 API
export const deleteBread = async (breadId: number): Promise<BreadDeleteResponse> => {
  try {
    const response = await instance.delete<BreadDeleteResponse>(`/bread/${breadId}`);
    return response.data;
  } catch (error) {
    console.error('빵 삭제 중 오류 발생:', error);
    throw error;
  }
}; 