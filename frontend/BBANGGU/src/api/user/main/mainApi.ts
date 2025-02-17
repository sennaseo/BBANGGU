import axios from 'axios';
import { ApiResponse } from '../../../types/response';
import type { PackageType, PackageResponse, BakerySearchItem } from '../../../types/bakery';
import type { BakeryInfo } from '../../../store/slices/bakerySlice';
import { store } from '../../../store';

// const BASE_URL = 'http://127.0.0.1:8080';
// const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://13.124.56.79:8081';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const mainApi = {
  getAllBakeries: async () => {
    try {
      const token = store.getState().user.token;
      let response;
      if (token) {
        response = await axios.get<ApiResponse<BakeryInfo[]>>(
          `${BASE_URL}/bakery`,
          { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.get<ApiResponse<BakeryInfo[]>>(
          `${BASE_URL}/bakery`,
          { withCredentials: true }
        );
      }
      return response.data;
    } catch (error) {
      console.error('베이커리 목록 조회 실패:', error);
      throw error;
    }
  },
  // bakeryId 기반으로 bread-package 데이터를 가져오는 API
  getPackagesByBakeryId: async (bakeryId: number): Promise<PackageType[]> => {
    try {
      const token = store.getState().user.token;
      let response;
      if (token) {
        response = await axios.get<PackageResponse>(
          `${BASE_URL}/bread-package/bakery/${bakeryId}`,
          { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.get<PackageResponse>(
          `${BASE_URL}/bread-package/bakery/${bakeryId}`,
          { withCredentials: true }
        );
      }
      const packages = response.data.data;
      if (!packages || packages.length === 0) {
        // console.warn(`패키지 데이터 없음 - 가게(${bakeryId})의 패키지 정보가 없습니다.`);
        return [{ packageId: 0, bakeryId, name: "", price: 0, quantity: 0 }];
      }
      return packages;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          console.warn(`404 상태 - 가게(${bakeryId})의 패키지 정보 없음`);
          return [{ packageId: 0, bakeryId, name: "", price: 0, quantity: 0 }];
        }
        console.error(`가게(${bakeryId})의 패키지 조회 중 에러:`, error);
      } else {
        console.error(`예상치 못한 에러:`, error);
      }
      throw error;
    }
  },

  // /favorite/{bakeryId} 엔드포인트를 호출하여 좋아요 토글 처리하는 API 함수 추가
  toggleFavorite: async (bakeryId: number): Promise<boolean> => {
    try {
      const token = store.getState().user.token;
      const response = await axios.post(
        `${BASE_URL}/favorite/${bakeryId}`,
        {},
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("toggleFavorite", response.data.data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`가게(${bakeryId}) 좋아요 토글 실패:`, error);
        throw error;
      }
      throw error;
    }
  },
  // 관심가게 삭제 API: /favorite/{bakeryId}에 DELETE 요청
  deleteFavorite: async (bakeryId: number): Promise<boolean> => {
    try {
      const token = store.getState().user.token;
      const response = await axios.delete(
        `${BASE_URL}/favorite/${bakeryId}`,
        {
          withCredentials: false,
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          }
        },
      );
      console.log("deleteFavorite", response.data.data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`관심가게 삭제 실패 - 가게(${bakeryId}):`, error);
        throw error;
      }
      throw error;
    }
  }, 

  // 좋아요가 가장 많은 가게 조회 API (/favorite/best)
  getFavoriteBest: async () => {
    try {
      const token = store.getState().user.token;
      let response;
      if (token) {
        response = await axios.get<ApiResponse<BakeryInfo[]>>(
          `${BASE_URL}/favorite/best`,
          { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.get<ApiResponse<BakeryInfo[]>>(
          `${BASE_URL}/favorite/best`,
          { withCredentials: true }
        );
      }
      return response.data;
    } catch (error) {
      console.error(`
        좋아요가 가장 많은 가게 조회 실패:`, error);
      throw error;
    }
  },
  searchBakery: async (keyword: string) => {
    try {
      const token = store.getState().user.token;
      const response = await axios.get<ApiResponse<BakeryInfo[]>>(
        `${BASE_URL}/bakery/search?keyword=${keyword}`,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error(`베이커리 검색 실패:`, error);
      throw error;
    }
  } 
}

