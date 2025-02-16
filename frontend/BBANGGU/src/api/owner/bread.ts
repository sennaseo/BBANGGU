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
    
    // bread 필드에 JSON 데이터를 문자열로 변환하여 추가
    formData.append('bread', JSON.stringify(breadData));

    // 이미지가 있으면 추가
    if (breadImage) {
      formData.append('breadImage', breadImage);
    }

    // 요청 데이터 확인
    console.log('=== 전송 데이터 ===');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    const response = await instance.post<BreadRegisterResponse>('/bread', formData, {
      headers: {
        // Content-Type을 설정하지 않음 (axios가 자동으로 설정)
      }
    });

    return response.data;
  } catch (error) {
    console.error('빵 등록 실패:', error);
    throw error;
  }
};

export const getBakeryBreads = async (bakeryId: number): Promise<BreadInfo[]> => {
  try {
    const response = await instance.get<BreadInfo[]>(`/bread/bakery/${bakeryId}`);
    console.log('요청하는 bakeryId:', bakeryId);
    console.log('API 결과:', response.data);
    return response.data;  // 배열 형태로 반환
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
    
    // bread 필드에 JSON 데이터를 문자열로 추가
    formData.append('bread', JSON.stringify(breadData));

    if (breadImage) {
      formData.append('breadImage', breadImage);
      // 이미지가 변경되면 breadImageUrl을 null로 설정
      breadData.breadImageUrl = null;
    }

    const response = await instance.put<BreadUpdateResponse>(`/bread/${breadId}`, formData, {
      headers: {
        // Content-Type을 명시적으로 설정하지 않음 (axios가 자동으로 설정하도록)
      }
    });

    return response.data;
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error('=== 빵 정보 수정 실패 ===');
    if (err.response) {
      console.error('에러 상태:', err.response.status);
      console.error('에러 데이터:', err.response.data);
    }
    throw new Error(err.response?.data?.message || '빵 정보 수정에 실패했습니다.');
  }
};

// 빵 정보 삭제 API
export const deleteBread = async (breadId: number): Promise<BreadDeleteResponse> => {
  try {
    const response = await fetch(`/api/bread/${breadId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('빵 삭제 실패');
    }

    const data = await response.json();
    return data as BreadDeleteResponse;  // 타입 명시
  } catch (error) {
    console.error('빵 삭제 중 오류 발생:', error);
    throw error;
  }
}; 