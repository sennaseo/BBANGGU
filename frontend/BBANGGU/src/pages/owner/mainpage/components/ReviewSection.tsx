import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { reviewApi } from '../../../../api/user/review/reviewApi';
import type { BakeryRating, ReviewType } from '../../../../types/bakery';

export const ReviewSection: React.FC<{ bakeryId: number }> = ({ bakeryId }) => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [bakeryRating, setBakeryRating] = useState<BakeryRating | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'photo'>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'rating'>('latest');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 리뷰 데이터 fetch
  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        setIsLoading(true);
        const [reviewsData, ratingData] = await Promise.all([
          reviewApi.getReviews(bakeryId),
          reviewApi.getAverageRating(bakeryId)
        ]);
        
        setReviews(reviewsData);
        setBakeryRating(ratingData);
      } catch (err) {
        console.error('리뷰 데이터 로딩 실패:', err);
        setError('리뷰를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewData();
  }, [bakeryId, activeFilter]);

  // 필터링 및 정렬된 리뷰 목록 계산
  const filteredAndSortedReviews = [...reviews]
    .filter(review => {
      if (activeFilter === 'photo') {
        return review.reviewImageUrl;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      // 최신순 정렬
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FC973B]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  // stats prop을 bakeryRating 데이터로 변환
  const stats = {
    average: bakeryRating?.average || 0,
    total: reviews.length,
    distribution: {
      5: bakeryRating?.star_rating[4] || 0,
      4: bakeryRating?.star_rating[3] || 0,
      3: bakeryRating?.star_rating[2] || 0,
      2: bakeryRating?.star_rating[1] || 0,
      1: bakeryRating?.star_rating[0] || 0,
    }
  };

  const photoReviewCount = reviews.filter(review => review.reviewImageUrl).length;

  return (
    <div className="w-full">
      {/* 평점 개요 섹션 */}
      <div className="flex w-[400px] h-[160px] p-[33px_23px] bg-white rounded-[10px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.15)] mx-auto mb-6">
        {/* 왼쪽: 평점 + 별점 - justify-center 추가로 세로 중앙 정렬 */}
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <span className="text-[48px] font-bold leading-none">
            {stats.average.toFixed(1)}
          </span>
          <div className="flex gap-[2px]">
            {[1,2,3,4,5].map(star => (
              <svg 
                key={star} 
                className="w-5 h-5 text-[#FC973B]" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>

        {/* 오른쪽: 별점 분포도 */}
        <div className="flex-1 ml-[40px]">
          {[5,4,3,2,1].map(rating => (
            <div key={rating} className="flex items-center h-[18px]">
              <div className="w-[32px] text-xs text-right">
                {rating}점
              </div>
              <div className="relative flex-1 mx-2">
                <div className="absolute w-full h-[6px] bg-gray-100 rounded-full" />
                <div 
                  className="absolute h-[6px] bg-[#FC973B] rounded-full"
                  style={{
                    width: `${Math.min((stats.distribution[rating as keyof typeof stats.distribution] / stats.total) * 120, 100)}%`
                  }}
                />
              </div>
              <div className="w-[36px] text-xs text-gray-400 text-right">
                {stats.distribution[rating as keyof typeof stats.distribution]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 리뷰 리스트 섹션 */}
      <div className="w-[400px] mx-auto">
        {/* 필터 옵션 - 정렬 드롭다운 추가 */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button 
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${
                activeFilter === 'all' 
                  ? 'bg-[#FC973B] text-white' 
                  : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              전체 ({stats.total})
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${
                activeFilter === 'photo' 
                  ? 'bg-[#FC973B] text-white' 
                  : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setActiveFilter('photo')}
            >
              사진 리뷰 ({photoReviewCount})
            </button>
          </div>

          {/* 정렬 드롭다운 */}
          <div className="relative">
            <button 
              className={`text-sm transition-colors flex items-center gap-1 ${
                isDropdownOpen ? 'text-[#FC973B]' : 'text-gray-500'
              }`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {sortBy === 'latest' ? '최신순' : '별점순'}
              <ChevronDownIcon 
                className={`w-4 h-4 transition-transform ${
                  isDropdownOpen ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg py-1 z-10 w-[70px]">
                <button 
                  className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                    sortBy === 'latest' ? 'text-[#FC973B]' : 'text-gray-500'
                  }`}
                  onClick={() => {
                    setSortBy('latest');
                    setIsDropdownOpen(false);
                  }}
                >
                  최신순
                </button>
                <button 
                  className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                    sortBy === 'rating' ? 'text-[#FC973B]' : 'text-gray-500'
                  }`}
                  onClick={() => {
                    setSortBy('rating');
                    setIsDropdownOpen(false);
                  }}
                >
                  별점순
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 리뷰 리스트 - 필터링 및 정렬된 리뷰 사용 */}
        <div className="bg-white rounded-[10px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.15)]">
          {filteredAndSortedReviews.map((review, index) => (
            <div key={review.reviewId}>
              <div className="p-4">
                {/* 리뷰 헤더 */}
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                    {/* 프로필 이미지가 있다면 추가 */}
                  </div>
                  <div className="ml-3">
                    <p className="font-bold text-[#333333]">{review.content}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < review.rating ? 'text-[#FC973B]' : 'text-gray-200'}`}
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-400">{review.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* 리뷰 이미지 */}
                {review.reviewImageUrl && (
                  <div className="mb-3">
                    <img 
                      src={review.reviewImageUrl} 
                      alt="리뷰 이미지" 
                      className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  </div>
                )}
              </div>
              
              {/* 마지막 리뷰가 아닐 경우에만 구분선 추가 */}
              {index !== filteredAndSortedReviews.length - 1 && (
                <div className="h-[1px] bg-gray-100" />
              )}
            </div>
          ))}

          {/* 필터링된 결과가 없을 경우 메시지 표시 */}
          {filteredAndSortedReviews.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              해당하는 리뷰가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 