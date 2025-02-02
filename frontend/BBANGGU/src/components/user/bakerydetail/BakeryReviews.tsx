import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import type { ReviewType } from "../../../types/bakery"
import { mockUsers } from "../../../mocks/mockUserData"

interface BakeryReviewsProps {
  bakery_id: number
  reviews: ReviewType[]
}

export default function BakeryReviews({ bakery_id, reviews }: BakeryReviewsProps) {
  if (reviews.length === 0) {
    return (
      <div className="py-[15px]">
        <h2 className="text-[16px] font-bold mb-[15px]">리뷰 구경하기</h2>
        <p className="text-[14px] text-[#757575]">아직 리뷰가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="py-[15px]">
      <Link to={`/bakery/${bakery_id}/reviews`} className="mb-[15px] flex w-full items-center justify-between">
        <h2 className="text-[16px] font-bold">리뷰 구경하기</h2>
        <ChevronRight className="h-5 w-5" />
      </Link>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.slice(0, 2).map((review) => {
            const user = mockUsers[review.user_id]
            return (
              <div key={review.review_id} className="flex gap-4">
                {review.review_image_url && (
                  <img
                    src={review.review_image_url || "/placeholder.svg"}
                    alt="Review"
                    className="h-[162px] w-[142px] rounded-lg object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col justify-between py-1">
                  <div className="space-y-[16px]">
                    <div className="flex gap-1">
                      {Array(review.rating)
                        .fill("⭐")
                        .map((star, i) => (
                          <span key={`star-${review.review_id}-${i}`} className="text-[10px]">
                            {star}
                          </span>
                        ))}
                    </div>
                    <p className="text-[14px] text-[#757575] line-clamp-2">{review.content}</p>
                  </div>
                  <div className="flex items-center justify-between text-[13px] text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={user.profile_image_url || "/placeholder.svg"}
                        alt={user.username}
                        className="w-[27px] h-[27px] rounded-full object-cover"
                      />
                      <span className="text-[#606060]">{user.username}</span>
                    </div>
                    <span className="text-[#D3D3D3]">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-[14px] text-[#757575]">아직 리뷰가 없습니다.</p>
      )}
    </div>
  )
}

