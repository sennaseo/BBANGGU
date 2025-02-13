import axios from 'axios';
import axiosInstance from '../axios';
import { PackageType } from '../../types/bakery';

interface PackageResponse {
  message: string;
  data: PackageType[];
}

export const getBakeryPackages = async (bakeryId: number): Promise<PackageType[]> => {
  try {
    console.log('요청 시작:', {
      url: `/bread-package/bakery/${bakeryId}`,
      headers: {
        'Authorization': axiosInstance.defaults.headers.common['Authorization']
      }
    });

    const response = await axiosInstance.get<PackageResponse>(`/bread-package/bakery/${bakeryId}`);
    
    // 응답 구조 확인을 위한 로그
    console.log('전체 응답:', response);
    
    // data 필드가 있는지 확인
    if (!response.data || !response.data.data) {
      console.error('잘못된 응답 형식:', response.data);
      return [];
    }

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('상세 에러 정보:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      
      if (error.response?.status === 500) {
        // 서버 에러의 경우 빈 배열 반환
        console.warn('서버 에러 발생 - 빈 배열 반환');
        return [];
      }
      if (error.response?.status === 404) {
        return [];
      }
    }
    throw error;
  }
};