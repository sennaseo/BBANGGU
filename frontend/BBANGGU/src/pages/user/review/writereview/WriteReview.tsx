import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StarRating } from '../../../../components/user/review/writereview/StarRating';
import { ImageUpload } from '../../../../components/user/review/writereview/ImageUpload';
import { writeReviewService } from '../../../../services/user/review/writereview/writeReviewService';
import { AlertModal } from '../../../../components/common/AlertModal';

export function WriteReview() {
  const navigate = useNavigate();
  const { reservationId } = useParams<{ reservationId: string }>();
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertModal, setAlertModal] = useState<{isOpen: boolean; message: string}>({
    isOpen: false,
    message: '',
  });

  const closeModal = () => {
    setAlertModal({ isOpen: false, message: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservationId) return;
    
    // 제출 시에만 유효성 검사
    if (rating === 0) {
      setAlertModal({
        isOpen: true,
        message: '별점을 선택해주세요.'
      });
      return;
    }

    if (content.trim().length < 10) {
      setAlertModal({
        isOpen: true,
        message: '리뷰는 최소 10자 이상 작성해주세요.'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const reviewData = {
        rating,
        content,
        reservationId: parseInt(reservationId),
        ...(images.length > 0 ? { file: images[0] } : {})
      };
      await writeReviewService.submitReview(reviewData);
      alert('리뷰가 성공적으로 등록되었습니다.');
      navigate('..', { 
        state: { reviewSubmitted: true }
      });
    } catch (error) {
      setAlertModal({
        isOpen: true,
        message: '리뷰 등록에 실패했습니다. 다시 시도해주세요.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-5 py-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6 relative">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold absolute left-1/2 -translate-x-1/2 text-[#333333]">
            리뷰 작성
          </h1>
          <div className="w-6" />
        </div>

        {/* 리뷰 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 별점 섹션 */}
          <div className="space-y-2">
            <h2 className="font-semibold text-lg text-[#333333]">별점</h2>
            <StarRating 
              rating={rating} 
              onRatingChange={(newRating) => setRating(newRating)} 
            />
          </div>

          {/* 리뷰 내용 */}
          <div className="space-y-2">
            <h2 className="font-semibold text-lg text-[#333333]">리뷰 작성</h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="최소 10자 이상 작성해주세요"
              className="w-full h-32 p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#fc973b]"
            />
            <p className="text-sm text-gray-500">
              {content.length}/500자
            </p>
          </div>

          {/* 이미지 업로드 */}
          <div className="space-y-2">
            <h2 className="font-semibold text-lg text-[#333333]">사진 첨부</h2>
            <ImageUpload images={images} onImagesChange={setImages} />
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 max-w-[400px] w-full bg-[#fc973b] text-white py-3 rounded-xl font-semibold disabled:bg-gray-300"
          >
            {isSubmitting ? '등록 중...' : '리뷰 등록하기'}
          </button>
        </form>
      </div>
      <AlertModal 
        isOpen={alertModal.isOpen}
        message={alertModal.message}
        onClose={closeModal}
      />
    </div>
  );
} 