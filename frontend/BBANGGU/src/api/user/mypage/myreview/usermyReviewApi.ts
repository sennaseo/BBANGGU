import axios from 'axios';
import type { ReviewType, UserReviewResponse } from '../../../../types/bakery';
import { store } from '../../../../store';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchUserReviews = async (userId: string): Promise<ReviewType[]> => {
  try {
    const token = store.getState().auth.accessToken;
    const response = await axios.get<UserReviewResponse>(`${BASE_URL}/review/user/${userId}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  } catch (error) {
    throw new Error('리뷰를 불러오는데 실패했습니다.');
  }
}; 