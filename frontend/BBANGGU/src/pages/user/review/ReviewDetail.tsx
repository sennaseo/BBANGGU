import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Star } from 'lucide-react';
import { reviewApi } from '../../../api/user/review/reviewApi';
import { ReviewType } from '../../../types/bakery';

export function ReviewDetail() {
  const { userId, reservationId } = useParams<{ userId: string; reservationId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const bakeryName = (location.state as { bakeryName?: string } | undefined)?.bakeryName;

  const [review, setReview] = useState<ReviewType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleReviewDelete = async () => {
    if (!review) return;
    try {
      await reviewApi.deleteReview(review.reviewId);
      navigate(`/user/${userId}/mypage/reviews/${reservationId}`, { state: { deleted: true, bakeryName } });
    } catch (error) {
      console.error("리뷰 삭제 실패: ", error);
    }
  };

  useEffect(() => {
    if (userId && reservationId) {
      const fetchReview = async () => {
        try {
          const result = await reviewApi.findReviewByReservationId(userId, reservationId);
          setReview(result);
        } catch (err) {
          console.error("리뷰 조회 에러", err);
          setError("리뷰를 불러오는 중에 오류가 발생했습니다.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchReview();
    }
  }, [userId, reservationId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#fc973b]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <p className="text-red-500 mb-4">{error}</p>
        <button className="px-4 py-2 bg-[#fc973b] text-white rounded-md" onClick={() => navigate(-1)}>
          뒤로가기
        </button>
      </div>
    );
  }

  if (!review) {
    const isDeleted = (location.state as any)?.deleted;
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <p className="text-gray-500 mb-4">{isDeleted ? "삭제되었습니다." : "리뷰가 존재하지 않습니다."}</p>
        <button className="px-4 py-2 bg-[#fc973b] text-white rounded-md" onClick={() => navigate(-1)}>
          뒤로가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4 relative">
      <div className="relative w-full max-w-md mb-6">
        <button onClick={() => navigate(-1)} className="absolute left-0 top-1/2 -translate-y-1/2">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 text-center">내가 쓴 리뷰</h1>
      </div>
      <div className="w-full max-w-md bg-white rounded-lg">
        {bakeryName && (
          <div className="mb-4">
            <p className="text-[20px] text-[#333333] font-bold">{bakeryName}</p>
          </div>
        )}
        <div className="flex flex-col shadow-md rounded-xl p-4">
            <div className="mb-4">
              <div className="flex items-center">
                <span className="font-bold text-gray-700 mr-2">별점:</span>
                <div className="flex items-center">
                  {[...Array(Math.floor(review.rating))].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                  {review.rating % 1 !== 0 && (
                    <Star className="w-5 h-5 text-yellow-400 opacity-50" />
                  )}
                </div>
              </div>
            </div>
            <div className="mb-4">
              {review.reviewImageUrl && review.reviewImageUrl.trim() !== '' && (
                <div className="mb-5">
                  <img src={review.reviewImageUrl} alt="리뷰 이미지" className="w-full rounded-xl" />
                </div>
              )}
              <span className="font-bold text-gray-700 block mb-1">리뷰 내용:</span>
              <p className="text-gray-800">{review.content}</p>
            </div>
            <div className="text-sm text-gray-500 text-right">
              작성일: {new Date(review.createdAt).toLocaleDateString()}
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-red-500 text-white rounded-xl">
                리뷰 삭제
              </button>
            </div>
          </div>
        </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm">
            <h2 className="text-lg font-bold mb-4">리뷰 삭제 확인</h2>
            <p className="mb-4">정말로 리뷰를 삭제하시겠습니까?</p>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-xl">
                취소
              </button>
              <button onClick={handleReviewDelete} className="px-4 py-2 bg-red-500 text-white rounded-xl">
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 