import { ApiResponse } from '../../types/api';

interface PickupTime {
  startTime: string;
  endTime: string;
}

interface PickupTimeRequest {
  monday?: PickupTime;
  tuesday?: PickupTime;
  wednesday?: PickupTime;
  thursday?: PickupTime;
  friday?: PickupTime;
  saturday?: PickupTime;
  sunday?: PickupTime;
}

interface PickupTimeAllResponse {
  sunday: PickupTime | null;
  saturday: PickupTime | null;
  tuesday: PickupTime | null;
  wednesday: PickupTime | null;
  thursday: PickupTime | null;
  friday: PickupTime | null;
  monday: PickupTime | null;
}

// 픽업 시간 등록
export const createPickupTime = async (bakeryId: number, data: PickupTimeRequest): Promise<void> => {
  const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzM5NTExOTE5LCJleHAiOjE3NDAxMTY3MTl9.1TANi8zQMdtN3uHUGbcuNunWJxWLZoZPoNZ3uePfiUM'; // 테스트용 토큰
  
  try {
    const response = await fetch(`http://i12d102.p.ssafy.io:8081/bakery/${bakeryId}/pickup`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.code === 1011) {
        throw new Error('인증이 필요한 사용자입니다.');
      }
      throw new Error(errorData.message || '픽업 시간 등록에 실패했습니다.');
    }

    const responseData = await response.json();
    return responseData.data;
  } catch (error) {
    console.error('Error creating pickup time:', error);
    throw error;
  }
};

// 픽업 시간 조회 (오늘)
export const getPickupTime = async (bakeryId: number): Promise<PickupTime | null> => {
  try {
    const response = await fetch(`http://i12d102.p.ssafy.io:8081/bakery/${bakeryId}/pickup`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.code === 2002) {
        throw new Error('가게를 찾을 수 없습니다.');
      }
      throw new Error(errorData.message || '픽업 시간 조회에 실패했습니다.');
    }

    const responseData: ApiResponse<PickupTime | null> = await response.json();
    return responseData.data;
  } catch (error) {
    console.error('Error fetching pickup time:', error);
    throw error;
  }
};

// 픽업 시간 수정
export const updatePickupTime = async (bakeryId: number, data: PickupTimeRequest): Promise<void> => {
  const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzM5NTExOTE5LCJleHAiOjE3NDAxMTY3MTl9.1TANi8zQMdtN3uHUGbcuNunWJxWLZoZPoNZ3uePfiUM'; // 테스트용 토큰
  
  try {
    const response = await fetch(`http://i12d102.p.ssafy.io:8081/bakery/${bakeryId}/pickup`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.code === 1011) {
        throw new Error('인증이 필요한 사용자입니다.');
      }
      throw new Error(errorData.message || '픽업 시간 수정에 실패했습니다.');
    }

    const responseData = await response.json();
    return responseData.data;
  } catch (error) {
    console.error('Error updating pickup time:', error);
    throw error;
  }
};

// 픽업 시간 전체 조회
export const getAllPickupTimes = async (bakeryId: number): Promise<PickupTimeAllResponse> => {
  const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzM5NTExOTE5LCJleHAiOjE3NDAxMTY3MTl9.1TANi8zQMdtN3uHUGbcuNunWJxWLZoZPoNZ3uePfiUM'; // 테스트용 토큰
  
  try {
    const response = await fetch(`http://i12d102.p.ssafy.io:8081/bakery/${bakeryId}/pickup_all`, {
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
      throw new Error(errorData.message || '픽업 시간 전체 조회에 실패했습니다.');
    }

    const responseData: ApiResponse<PickupTimeAllResponse> = await response.json();
    return responseData.data;
  } catch (error) {
    console.error('Error fetching all pickup times:', error);
    throw error;
  }
};
