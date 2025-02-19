import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { reviewApi } from '../../../../api/user/review/reviewApi';
import type { BakeryRating, ReviewType } from '../../../../types/bakery';
import { getUserInfo } from '../../../../api/user/user';
import { getBakeryByOwner } from '../../../../api/owner/bakery';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ReviewSection: React.FC = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [bakeryRating, setBakeryRating] = useState<BakeryRating | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'photo'>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'rating'>('latest');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bakeryId, setBakeryId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 베이커리 정보 조회
  useEffect(() => {
    const fetchBakeryInfo = async () => {
      try {
        const userData = await getUserInfo();

        if (userData.role !== 'OWNER') {
          navigate('/');
          return;
        }

        try {
          const bakeryData = await getBakeryByOwner();
          setBakeryId(bakeryData.bakeryId);
        } catch (error) {
          console.error('Error fetching bakery:', error);
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            alert('베이커리 정보를 찾을 수 없습니다. 베이커리를 먼저 등록해주세요.');
            navigate('/owner/bakery/register');
            return;
          }
          throw error;
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        alert('사장님 정보를 가져오는데 실패했습니다.');
        navigate('/');
      }
    };

    fetchBakeryInfo();
  }, [navigate]);

  // bakeryId가 있을 때만 리뷰 데이터 fetch
  useEffect(() => {
    const fetchReviewData = async () => {
      if (!bakeryId) return;

      try {
        console.log("📌 리뷰 데이터 조회 시작 !!!")
        setIsLoading(true);
        const [reviewsData, ratingData] = await Promise.all([
          reviewApi.getReviews(bakeryId),
          reviewApi.getAverageRating(bakeryId)
        ]);

        const processedReviews = reviewsData.map(review => ({
          ...review,
          profileImageUrl: review.profileImageUrl || "/default-profile.png"
        }));
        console.log("📌 조회된 리뷰 데이터:", reviewsData);

        setReviews(processedReviews);
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
            {[1, 2, 3, 4, 5].map(star => (
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
          {[5, 4, 3, 2, 1].map(rating => (
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
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${activeFilter === 'all'
                ? 'bg-[#FC973B] text-white'
                : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
                }`}
              onClick={() => setActiveFilter('all')}
            >
              전체 ({stats.total})
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition-colors ${activeFilter === 'photo'
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
              className={`text-sm transition-colors flex items-center gap-1 ${isDropdownOpen ? 'text-[#FC973B]' : 'text-gray-500'
                }`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {sortBy === 'latest' ? '최신순' : '별점순'}
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''
                  }`}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg py-1 z-10 w-[70px]">
                <button
                  className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${sortBy === 'latest' ? 'text-[#FC973B]' : 'text-gray-500'
                    }`}
                  onClick={() => {
                    setSortBy('latest');
                    setIsDropdownOpen(false);
                  }}
                >
                  최신순
                </button>
                <button
                  className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${sortBy === 'rating' ? 'text-[#FC973B]' : 'text-gray-500'
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
        <div className="bg-white rounded-[10px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.15)] pb-4">
          {filteredAndSortedReviews.map((review, index) => (
            <div key={review.reviewId}>
              <div className="p-4">
                {/* 리뷰 헤더 */}
                <div className="flex items-center mb-3">
                  <img
                    src={review.profileImageUrl}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    onError={(e) => { 
                      (e.target as HTMLImageElement).src = "/default-profile.jpg"; 

                    }}
                  />
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
                      <span className="text-sm text-gray-400">{review.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* 리뷰 이미지 */}
                {review.reviewImageUrl && (
                  <div className="mb-2">
                    <img
                      src={review.reviewImageUrl}
                      alt="리뷰 이미지"
                      className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(review.reviewImageUrl ?? null)}
                    />
                  </div>
                )}
              </div>

              {/* 리뷰 내용 */}
              <p className="text-gray-600 pl-4">{review.content}</p>

              {/* 마지막 리뷰가 아닐 경우 구분선 추가 */}
              {index !== filteredAndSortedReviews.length - 1 && (
                <div className="h-[1px] bg-gray-100 mt-4" />
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

      {/* 🔹 모달 (이미지 클릭 시 확대) */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)} // ✅ 모달 닫기
        >
          <img src={selectedImage} alt="확대된 리뷰 이미지" className="max-w-[60%] max-h-[60%] rounded-lg shadow-lg" />
        </div>
      )}
    </div>
  );
}; 