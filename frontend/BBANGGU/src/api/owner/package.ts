import axios from 'axios';
import { ApiResponse } from '../../types/api';
import { PackageType } from '../../types/bakery';

// ApiResponse 래퍼 제거 - API가 직접 배열을 반환하므로
export const getBakeryPackages = async (bakeryId: number): Promise<PackageType[]> => {
  try {
    const apiUrl = `/bread-package/bakery/${bakeryId}`;
    
    try {
      const response = await axios.get<ApiResponse<PackageType[]>>(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // 모든 상태 코드를 허용하여 빨간색 오류 방지
        validateStatus: () => true
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
    } catch (axiosError) {
      // 네트워크 오류만 여기서 잡음
      console.error('Network Error:', axiosError);
      throw new Error('네트워크 연결을 확인해주세요.');
    }
  } catch (error) {
    console.error('Unexpected Error:', error);
    throw new Error('빵꾸러미 정보를 불러오는데 실패했습니다.');
  }
};