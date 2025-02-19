import { Star } from 'lucide-react';
import { useState } from 'react';
import type { ReviewType } from '../../../store/slices/reviewSlice';
import { deleteReview } from '../../../services/user/review/reviewService';
interface ReviewCardProps {
  review: ReviewType;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  // 상태: 삭제 모달 열림 여부
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleDeleteReview = () => {
    deleteReview(review.reviewId);
    setIsModalOpen(false);
  }
  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`w-4 h-4 ${
                  index < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
        
        {review.reviewImageUrl && (
          <div className="mb-3">
            <img
              src={review.reviewImageUrl}
              alt="리뷰 이미지"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
        <p className="text-gray-700">{review.content}</p>
        <span className="flex justify-end text-sm text-gray-400">
          {new Date(review.createdAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
        <div className="flex justify-end mt-2">
          <button
            className="text-sm text-white bg-red-500 rounded-xl px-2 py-1"
            onClick={() => setIsModalOpen(true)}
          >
            삭제
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl p-4 w-60">
            <p className="text-gray-700 mb-4">정말 삭제하시겠습니까?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-300 text-gray-800"
              >
                취소
              </button>
              <button
                onClick={handleDeleteReview}
                className="px-4 py-2 rounded-xl bg-red-500 text-white"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 