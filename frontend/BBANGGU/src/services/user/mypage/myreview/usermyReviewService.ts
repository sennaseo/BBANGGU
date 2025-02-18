import { fetchUserReviews } from '../../../../api/user/mypage/myreview/usermyReviewApi';
import type { ReviewType } from '../../../../store/slices/reviewSlice';


export const getUserReviews = async (userId: string): Promise<ReviewType[]> => {
  try {
    const reviews = await fetchUserReviews(userId);
    console.log("reviews", reviews);
    return reviews;
  } catch (error) {
    throw error;
  }
}; 