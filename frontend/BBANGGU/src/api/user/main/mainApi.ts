import axios from 'axios';
import { ApiResponse } from '../../../types/response';
import type { BakeryType, PackageType, BakerySearchItem } from '../../../types/bakery';

// const BASE_URL = 'http://127.0.0.1:8080';
// const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://13.124.56.79:8081';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const mainApi = {
  getAllBakeries: async () => {
    try {
      const response = await axios.get<ApiResponse<BakeryType[]>>(
        `${BASE_URL}/bakery`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error('베이커리 목록 조회 실패:', error);
      throw error;
    }
  },
  // bakeryId 기반으로 bread-package 데이터를 가져오는 API
  getPackagesByBakeryId: async (bakeryId: number): Promise<PackageType[]> => {
    try {
      const response = await axios.get<PackageType[]>(
        `${BASE_URL}/bread-package/bakery/${bakeryId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          console.warn(`404 상태 - 가게(${bakeryId})의 패키지 정보 없음`);
          return [];
        }
        console.error(`가게(${bakeryId})의 패키지 조회 중 에러:`, error);
      } else {
        console.error(`예상치 못한 에러:`, error);
      }
      throw error;
    }
  },
  // /favorite/{bakeryId} 엔드포인트를 호출하여 좋아요 토글 처리하는 API 함수 추가
  toggleFavorite: async (bakeryId: number): Promise<any> => {
    try {
      const response = await axios.post<ApiResponse<any>>(
        `${BASE_URL}/favorite/${bakeryId}`,
        {},
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`가게(${bakeryId}) 좋아요 토글 실패:`, error);
        throw error;
      }
      throw error;
    }
  },
  // 좋아요가 가장 많은 가게 조회 API (/favorite/best)
  getFavoriteBest: async () => {
    try {
      const response = await axios.get<ApiResponse<BakeryType[]>>(
        `${BASE_URL}/favorite/best`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error(`좋아요가 가장 많은 가게 조회 실패:`, error);
      throw error;
    }
  },
  // 가게 검색 요청 함수 추가
  searchBakery: async (keyword: string) => {
    try {
      const response = await axios.get<ApiResponse<{ content: BakerySearchItem[] }>>(
        `${BASE_URL}/bakery/search`,
        {
          params: { keyword },
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      console.error(`가게 검색 실패:`, error);
      throw error;
    }
  }
};

export async function searchBakery(keyword: string) {
  return await mainApi.searchBakery(keyword);
}