import { ArrowDownWideNarrow, Camera } from "lucide-react"
import type { ReviewType, UserType } from "../../../types/bakery"
import ReviewCard from "./ReviewCard"

interface ReviewListProps {
  reviews: ReviewType[]
  sortBy: "latest" | "highest" | "lowest"
  user: UserType
  onSortChange: (value: "latest" | "highest" | "lowest") => void
}

export default function ReviewList({
  reviews,
  sortBy,
  onSortChange,
  user,
}: ReviewListProps) {
  return (
    <div className="bg-white">
      <div className="px-5 py-4 flex items-center justify-between border-b border-[#F2F2F2]">
        <h2 className="text-lg font-bold">
          최근 리뷰 <span className="text-[#757575]">{reviews.length}개</span>
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const nextSort = sortBy === "latest" ? "highest" : sortBy === "highest" ? "lowest" : "latest"
              onSortChange(nextSort)
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F2F2F2] text-[#757575] text-sm"
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
          <ReviewCard key={review.reviewId} review={review} user={user} />
        ))}
      </div>
    </div>
  )
}

