import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import type { ReviewType } from "../../types/bakery"

interface BakeryReviewsProps {
  reviews: ReviewType[]
}

export default function BakeryReviews({ reviews }: BakeryReviewsProps) {
  return (
    <div className="py-[15px]">
      <Link to="reviews" className="mb-[15px] flex w-full items-center justify-between">
        <h2 className="text-[16px] font-bold">리뷰 구경하기</h2>
        <ChevronRight className="h-5 w-5" />
      </Link>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-4">
            {review.image && (
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%A6%AC%EB%B7%B0%20%EC%82%AC%EC%A7%84-tZmeyUv7Syj13HMJkn3kJY7PT6elS7.png"
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
                      <span key={i} className="text-[10px]">
                        {star}
                      </span>
                    ))}
                </div>
                <p className="text-[14px] text-[#757575] line-clamp-2">{review.content}</p>
              </div>
              <div className="flex items-center justify-between text-[13px] text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-[27px] h-[27px] rounded-full bg-gray-300"></div>
                  <span className="text-[#606060]">{review.author}</span>
                </div>
                <span className="text-[#D3D3D3]">{review.postedAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

