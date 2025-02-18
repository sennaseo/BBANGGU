import axios from 'axios';
import { ReviewFormData, ReviewResponse } from '../../../../types/bakery';
import { ApiResponse } from '../../../../types/response';
import { store } from '../../../../store';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const writeReviewApi = {
  submitReview: async (review: ReviewFormData & { file?: File }): Promise<ReviewResponse> => {
    try {
      const token = store.getState().auth.accessToken;
      // FormData로 리뷰 데이터 감싸기
      const formData = new FormData();
      // review 키의 값은 review.json 파일 형태로 전달
      const reviewPayload = {
        reservationId: review.reservationId,
        rating: review.rating,
        content: review.content,
      };
      formData.append("review", new Blob([JSON.stringify(reviewPayload)], { type: "application/json" }), "review.json");

      // reviewImage 키에 파일을 첨부 (파일이 있을 때만)
      if (review.file) {
        formData.append("reviewImage", review.file, review.file.name);
      }
      // 디버깅: FormData에 담긴 내용 확인
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.post<ApiResponse<ReviewResponse>>(
        `${BASE_URL}/review`, 
        formData, 
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
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