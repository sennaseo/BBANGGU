import axios from "axios";
import { ApiResponse } from "../../../types/response";
import type { ReviewState, ReviewType } from '../../../store/slices/reviewSlice';
import { BakeryRating } from "../../../types/bakery";
import { API_BASE_URL } from "../../../config/env";
const BASE_URL = API_BASE_URL;

export const reviewApi = {
    getReviews: async (bakeryId: number): Promise<ReviewType[]> => {
    try {
      const response = await axios.get<ApiResponse<ReviewType[]>>(
        `${BASE_URL}/review/bakery/${bakeryId}`,
        { withCredentials: true,
        }
      );
      return response.data.data.map(review => ({
        ...review
      }));
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

  getUserReviews: async (userId: string): Promise<ReviewState> => {
    try {
      const response = await axios.get<ApiResponse<ReviewState>>(
        `${BASE_URL}/review/user/${userId}`,
        {
          withCredentials: true,
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
      await axios.delete<ApiResponse<void>>(`${BASE_URL}/review/${reviewId}`, { withCredentials: true,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('리뷰 삭제 실패:', error);
      }
      throw error;
    }
  },
};

