import axios from 'axios';
import type { ReviewState } from '../../../../store/slices/reviewSlice';
import { API_BASE_URL } from '../../../../config/env';
const BASE_URL = API_BASE_URL;

export const fetchUserReviews = async (userId: string): Promise<ReviewState> => {
  try {
    const response = await axios.get<ReviewState>(`${BASE_URL}/review/user/${userId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw new Error('리뷰를 불러오는데 실패했습니다.');
  }
}; 