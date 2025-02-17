import axios from "axios";
import { ApiResponse } from "../../../types/response";
import type { BakeryRating, ReviewType } from "../../../types/bakery";
import { store } from '../../../store';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const reviewApi = {
    getReviews: async (bakeryId: number): Promise<ReviewType[]> => {
    try {
      const token = store.getState().user.token;  
      const response = await axios.get<ApiResponse<ReviewType[]>>(
        `${BASE_URL}/review/bakery/${bakeryId}`,
        { withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`리뷰 조회 실패 - 가게(${bakeryId}):`, error);
        throw error;
      }
      throw error;
    }
  }, 
  // 새로운 평균별점 요청 함수
  getAverageRating: async (bakeryId: number): Promise<BakeryRating> => {
    try {
      const response = await axios.get<ApiResponse<BakeryRating>>(
        `${BASE_URL}/review/${bakeryId}/rating`,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`평균별점 조회 실패 - 가게(${bakeryId}):`, error);
      }
      throw error;
    }
  },

  getUserReviews: async (userId: string): Promise<ReviewType[]> => {
    try {
      const token = store.getState().user.token;
      const response = await axios.get<ApiResponse<ReviewType[]>>(
        `${BASE_URL}/review/user/${userId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('유저 리뷰 조회 실패:', error);
      throw error;
    }
  },
  deleteReview: async (reviewId: number): Promise<void> => {
    try {
      const token = store.getState().user.token;
      await axios.delete<ApiResponse<void>>(`${BASE_URL}/review/${reviewId}`, { withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('리뷰 삭제 실패:', error);
      }
      throw error;
    }
  },
};

