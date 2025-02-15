import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import RatingSummary from "../../../components/user/review/RatingSummary"
import ReviewList from "../../../components/user/review/Reviewlist"
import { useState, useEffect } from "react";
import { getAverageRating, getReviews} from "../../../services/user/review/reviewService";
import type { BakeryRating, ReviewType, UserType } from "../../../types/bakery";
import { getUserProfile } from "../../../services/user/mypage/usermypageServices";

export default function UserReview() {
  const navigate = useNavigate();
  const { bakeryId } = useParams<{ bakeryId: string }>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reviews, setReviews] = useState<ReviewType[]>([])
  const [averageRating, setAverageRating] = useState<BakeryRating | null>(null)
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviews = await getReviews(Number(bakeryId))
        setReviews(reviews)
        const averageRating = await getAverageRating(Number(bakeryId))
        setAverageRating(averageRating)
        const users = await getUserProfile()
        setUser(users[0])
      } catch (error) {
        setError(error instanceof Error ? error.message : "리뷰를 불러오는 데 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [bakeryId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FFB933]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white px-5 h-[56px] flex items-center justify-between border-b border-[#F2F2F2]">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold">가게 리뷰</h1>
      </header>

      <main className="bg-[#F2F2F2]">
        <div className="pt-4">
          <RatingSummary averageRating={averageRating?.average || 0} ratingCounts={averageRating?.star_rating || []} totalReviews={reviews.length} />
        </div>
        <div className="bg-white">
          {user && (
            <ReviewList
              reviews={reviews}
              sortBy="latest"
              user={user}
              onSortChange={() => {}}
            />
          )}
        </div>
      </main>
    </div>
  )
}

