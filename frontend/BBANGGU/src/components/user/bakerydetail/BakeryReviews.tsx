import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import type { ReviewType, UserType } from "../../../types/bakery"

interface BakeryReviewsProps {
  bakeryId: number
  reviews: ReviewType[]
  user: UserType
}

export default function BakeryReviews({ bakeryId, reviews }: BakeryReviewsProps) {
  if (reviews.length === 0) {
    return (
      <div className="py-[15px]" style={{ marginTop: "0px !important", paddingTop: "0px !important" }}>
        <h2 className="text-[16px] font-bold mb-[15px]">리뷰 구경하기</h2>
        <p className="text-[14px] text-[#757575]">아직 리뷰가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="py-[15px]" style={{ marginTop: "0px !important", paddingTop: "0px !important" }}>
      <Link
        to={`/user/bakery/${bakeryId}/reviews`}
        className="mb-[15px] flex w-full items-center justify-between"
      >
        <h2 className="text-[16px] font-bold text-[#333333]">리뷰 구경하기</h2>
        <ChevronRight className="h-5 w-5" />
      </Link>
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.slice(0, 2).map((review) => {
            return (
              <div key={review.reviewId} className="flex gap-4">
                {review.reviewImageUrl && (
                  <div
                    className="h-[100px] w-[100px] overflow-hidden"
                    style={{ borderRadius: "12px" }} // ✅ 강제 적용
                  >
                    <img
                      src={review.reviewImageUrl}
                      alt="Review"
                      className="h-full w-full object-cover"
                      style={{ borderRadius: "12px" }} // ✅ 강제 적용
                    />
                  </div>
                )}

                {/* 리뷰 내용 */}
                <div className="flex flex-1 flex-col justify-center">
                  {/* 별점 */}
                  <div className="flex" style={{gap: "1px"}}>
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'text-[#FC973B]' : 'text-gray-200'
                          }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* 리뷰 텍스트 */}
                  <p className="mt-1 text-[14px] text-[#333333] line-clamp-2">{review.content}</p>

                  {/* 사용자 정보 */}
                  <div className="mt-3 flex items-center gap-2 text-[12px] text-gray-500">
                    <img
                      src={review.profileImageUrl || "/placeholder.svg"}
                      alt={review.userName}
                      className="w-[24px] h-[24px] rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/default-profile.jpg";
                      }}
                    />
                    <span className="text-[#606060]">{review.userName}</span>
                    <span className="ml-auto">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-[14px] text-[#757575]">아직 리뷰가 없습니다.</p>
      )}
    </div>
  );
}

