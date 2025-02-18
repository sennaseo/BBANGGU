import { fetchUserReviews } from '../../../../api/user/mypage/myreview/usermyReviewApi';
import type { ReviewState } from '../../../../store/slices/reviewSlice';


export const getUserReviews = async (userId: string): Promise<ReviewState> => {
  try {
    const reviews = await fetchUserReviews(userId);
    return reviews;
  } catch (error) {
    throw error;
  }
}; 