import axios from 'axios';
import { ReviewFormData, ReviewResponse } from '../../../../types/bakery';
import { ApiResponse } from '../../../../types/response';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const writeReviewApi = {
  submitReview: async (reservationId: string, data: ReviewFormData): Promise<ReviewResponse> => {
    try {
      const reviewData = {
        rating: data.rating,
        content: data.content,
        reservationId: reservationId
      };

      const token = localStorage.getItem("accessToken") || import.meta.env.VITE_MOCK_ACCESS_TOKEN || "";
      const response = await axios.post<ApiResponse<ReviewResponse>>(`${BASE_URL}/review`, reviewData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          throw new Error('이미 리뷰가 작성되어 있습니다.');
        }
      }
      throw error;
    }
  },
}; 