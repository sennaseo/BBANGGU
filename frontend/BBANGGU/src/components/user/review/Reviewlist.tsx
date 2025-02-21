import { ArrowDownWideNarrow, Camera } from "lucide-react"
import type { ReviewType, UserType } from "../../../types/bakery"
import ReviewCard from "./ReviewCard"
import { useState } from "react"

interface ReviewListProps {
  reviews: ReviewType[]
  sortBy: "latest" | "highest" | "lowest"
  user: UserType
  onSortChange: (value: "latest" | "highest" | "lowest") => void
  onImageClick?: (imageUrl: string) => void;
}

export default function ReviewList({
  reviews,
  sortBy,
  onSortChange,
  user,
}: ReviewListProps) {
  const [showOnlyPhotoReviews, setShowOnlyPhotoReviews] = useState(false)

  // 📌 필터링된 리뷰 목록 생성
  const filteredReviews = showOnlyPhotoReviews
    ? reviews.filter((review) => review.reviewImageUrl && review.reviewImageUrl.length > 0) // 📷 이미지가 있는 리뷰만 표시
    : reviews

  return (
    <div className="bg-white">
      <div className="px-5 py-4 flex items-center justify-between border-b border-[#F2F2F2]">
        <h2 className="text-lg font-bold">
          최근 리뷰 <span className="text-[#757575]">{reviews.length}개</span>
        </h2>
        <div className="flex items-center gap-2">
          {/* 사진 리뷰만 보기 버튼 */}
          <button
            onClick={() => setShowOnlyPhotoReviews(!showOnlyPhotoReviews)} // 버튼 클릭 시 토글
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${showOnlyPhotoReviews ? "bg-[#FC973B] text-white" : "bg-[#F2F2F2] text-[#757575]"
              }`}
          >
            <Camera className="w-4 h-4" />
            사진 리뷰만 보기
          </button>
          <button
            onClick={() => {
              const nextSort = sortBy === "latest" ? "highest" : sortBy === "highest" ? "lowest" : "latest"
              onSortChange(nextSort)
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2F2F2] text-[#757575] text-sm"
          >
            <ArrowDownWideNarrow className="w-4 h-4" />
            {sortBy === "latest" ? "최신순" : sortBy === "highest" ? "별점 높은순" : "별점 낮은순"}
          </button>
        </div>
      </div>
      {/* 리뷰 목록 */}
      <div className="divide-y divide-[#F2F2F2]">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewCard key={review.reviewId} review={review} user={user} />
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">😢 표시할 리뷰가 없습니다.</div>
        )}
      </div>
    </div>
  )
}

