import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useReview } from "../../../hooks/user/userReview"
import RatingSummary from "../../../components/user/review/RatingSummary"
import ReviewList from "../../../components/user/review/Reviewlist"


export default function UserReview() {
  const navigate = useNavigate();
  const { bakeryId } = useParams<{ bakeryId: string }>()
  const { reviews, ratingCounts, averageRating, loading, error, showPhotoOnly, setShowPhotoOnly, sortBy, setSortBy } =
    useReview(bakeryId!)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FFB933]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error.message}</p>
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
          <RatingSummary averageRating={averageRating} ratingCounts={ratingCounts} totalReviews={reviews.length} />
        </div>
        <div className="bg-white">
          <ReviewList
            reviews={reviews}
            showPhotoOnly={showPhotoOnly}
            sortBy={sortBy}
            onPhotoOnlyChange={setShowPhotoOnly}
            onSortChange={setSortBy}
          />
        </div>
      </main>
    </div>
  )
}

