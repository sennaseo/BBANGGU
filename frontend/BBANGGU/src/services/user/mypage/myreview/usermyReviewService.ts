import { fetchUserReviews } from '../../../../api/user/mypage/myreview/usermyReviewApi';
import type { UserReviewResponse } from '../../../../types/bakery';

export const getUserReviews = async (userId: string): Promise<UserReviewResponse> => {
  try {
    const reviews = await fetchUserReviews(userId);
    console.log("reviews", reviews);
    return { data: reviews };
  } catch (error) {
    throw error;
  }
}; 