import { EllipsisVertical } from "lucide-react"
import type { ReviewType } from "../../../types/bakery"
import { mockUsers } from "../../../mocks/user/mockUserData"

interface ReviewCardProps {
  review: ReviewType
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const user = mockUsers[review.user_id]
  const timeAgo = new Date(review.created_at).toLocaleDateString()

  return (
    <div className="px-5 py-4 border-b border-[#F2F2F2] last:border-b-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={user.profile_image_url || "/placeholder.svg"}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="text-[15px] font-medium">{user.name}</h3>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <svg
                      key={i}
                      className={`w-3 h-3 ${i < review.rating ? "text-[#FFB933]" : "text-[#D9D9D9]"} fill-current`}
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
              </div>
              <span className="text-xs text-[#757575]">{timeAgo}</span>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <EllipsisVertical className="w-5 h-5 text-[#757575]" />
        </button>
      </div>
      {review.review_image_url && (
        <img
          src={review.review_image_url || "/placeholder.svg"}
          alt="Review"
          className="w-full h-[200px] object-cover rounded-lg mb-3"
        />
      )}
      <p className="text-[15px] leading-relaxed text-[#333333]">{review.content}</p>
    </div>
  )
}

