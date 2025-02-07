import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

interface ReviewSectionProps {
  stats: {
    average: number;
    total: number;
    distribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  reviews: {
    id: number;
    userName: string;
    rating: number;
    content: string;
    date: string;
    imageUrl: string;
  }[];
}

// 더미 데이터 수정
const testData = {
  stats: {
    average: 4.7,
    total: 3,
    distribution: {
      5: 2,
      4: 1,
      3: 0,
      2: 0,
      1: 0
    }
  },
  reviews: [
    {
      id: 1,
      userName: "하얀",
      rating: 5,
      content: "매번 맛나게 먹고있습니다 정말좋습니다!! 빵도 신선하고 구성도 알차서 너무 만족스러워요.",
      date: "47분전"
    },
    {
      id: 2,
      userName: "김민지",
      rating: 4,
      content: "빵이 너무 맛있어요! 다음에도 꼭 이용하고 싶습니다. 특히 크로와상이 제일 맛있었어요.",
      date: "2시간전"
    },
    {
      id: 3,
      userName: "서지현",
      rating: 5,
      content: "오늘 처음 구매했는데 너무 만족스러워요! 빵이 정말 신선하고 맛있네요. 특히 단팥빵이 제일 맛있었어요. 사진처럼 구성도 알차고 좋습니다 ㅎㅎ",
      date: "3시간전",
      imageUrl: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80"
    }
  ]
};

export const ReviewSection: React.FC<ReviewSectionProps> = ({ stats }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'photo'>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'rating'>('latest');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 필터링 및 정렬된 리뷰 목록 계산
  const filteredAndSortedReviews = testData.reviews
    .filter(review => {
      if (activeFilter === 'photo') {
        return review.imageUrl;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      // 최신순은 이미 데이터가 정렬되어 있다고 가정
      return 0;
    });

  const photoReviewCount = testData.reviews.filter(review => review.imageUrl).length;

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
            <div key={review.id}>
              <div className="p-4">
                {/* 리뷰 헤더 */}
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                    {/* 프로필 이미지가 있다면 추가 */}
                  </div>
                  <div className="ml-3">
                    <p className="font-bold text-[#333333]">{review.userName}</p>
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
                      <span className="text-sm text-gray-400">{review.date}</span>
                    </div>
                  </div>
                </div>

                {/* 리뷰 이미지 */}
                {review.imageUrl && (
                  <div className="mb-3">
                    <img 
                      src={review.imageUrl} 
                      alt="리뷰 이미지" 
                      className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  </div>
                )}

                {/* 리뷰 내용 */}
                <p className="text-[#333333] leading-relaxed">{review.content}</p>
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