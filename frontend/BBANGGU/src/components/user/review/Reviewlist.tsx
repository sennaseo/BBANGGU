import { ArrowDownWideNarrow, Camera } from "lucide-react"
import type { ReviewType } from "../../../types/bakery"
import ReviewCard from "./ReviewCard"

interface ReviewListProps {
  reviews: ReviewType[]
  showPhotoOnly: boolean
  sortBy: "latest" | "highest" | "lowest"
  onPhotoOnlyChange: (value: boolean) => void
  onSortChange: (value: "latest" | "highest" | "lowest") => void
}

export default function ReviewList({
  reviews,
  showPhotoOnly,
  sortBy,
  onPhotoOnlyChange,
  onSortChange,
}: ReviewListProps) {
  return (
    <div className="bg-white">
      <div className="px-5 py-4 flex items-center justify-between border-b border-[#F2F2F2]">
        <h2 className="text-lg font-bold">
          최근 리뷰 <span className="text-[#757575]">{reviews.length}개</span>
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPhotoOnlyChange(!showPhotoOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm ${
              showPhotoOnly ? "bg-[#333333] text-white" : "bg-[#F2F2F2] text-[#757575]"
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
      <div className="divide-y divide-[#F2F2F2]">
        {reviews.map((review) => (
          <ReviewCard key={review.review_id} review={review} />
        ))}
      </div>
    </div>
  )
}

