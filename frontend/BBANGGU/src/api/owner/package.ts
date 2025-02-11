import axios from 'axios';
import { ApiResponse } from '../../types/api';
import { PackageType } from '../../types/bakery';

// ApiResponse 래퍼 제거 - API가 직접 배열을 반환하므로
export const getBakeryPackages = async (bakeryId: number): Promise<PackageType[]> => {
  try {
    // 상대 경로 사용 (프록시가 처리)
    const apiUrl = `/bread-package/bakery/${bakeryId}`;
    
    const response = await axios.get<ApiResponse<PackageType[]>>(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // 404인 경우 조용히 빈 배열 반환
    if (response.status === 404) {
      return [];
    }

    if (!response.data || !response.data.data) {
      console.log('Invalid response format:', response.data);
      return [];
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Network Error:', error);
      throw new Error('네트워크 연결을 확인해주세요.');
    }
    console.error('Unexpected Error:', error);
    throw new Error('빵꾸러미 정보를 불러오는데 실패했습니다.');
  }
};