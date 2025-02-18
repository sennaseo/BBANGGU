import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ReviewCard } from '../../../../components/user/myreview/ReviewCard';
import { getUserReviews } from '../../../../services/user/mypage/myreview/usermyReviewService';
import type { ReviewType } from '../../../../store/slices/reviewSlice';
import UserBottomNavigation from '../../../../components/user/navigations/bottomnavigation/UserBottomNavigation';

export default function UserMyReview() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!userId) {
        navigate('/login');
        return;
      }
      try {
        const response = await getUserReviews(userId);
        if (Array.isArray(response.data)) {
          setReviews(response.data);
        } else {
          setError('리뷰 데이터가 올바르지 않습니다.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '리뷰를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [userId, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fc973b"></div>
      </div>
    );
  }

  if (error) {
    return <div className="px-5 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-f9f9f9 pb-[60px]">
      <header className="flex items-center px-5 py-4 bg-white">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ChevronLeft className="w-6 h-6 text-333333" />
        </button>
        <h1 className="text-xl font-bold text-333333">나의 리뷰</h1>
      </header>

      <main className="px-5 py-4">
        {reviews.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            작성한 리뷰가 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.reviewId} review={review} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 