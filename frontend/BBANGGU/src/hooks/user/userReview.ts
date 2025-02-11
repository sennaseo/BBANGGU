import { useState, useEffect } from "react"
import { getReviews } from "../../services/user/ReviewService"
import type { ReviewType } from "../../types/bakery"

export function useReview(bakeryId: string) {
  const [reviews, setReviews] = useState<ReviewType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [showPhotoOnly, setShowPhotoOnly] = useState(false)
  const [sortBy, setSortBy] = useState<"latest" | "highest" | "lowest">("latest")

  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true)
        const data = await getReviews(bakeryId)
        setReviews(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch reviews"))
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [bakeryId])

  const filteredReviews = reviews
    .filter((review) => !showPhotoOnly || review.review_image_url)
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      if (sortBy === "highest") {
        return b.rating - a.rating
      }
      return a.rating - b.rating
    })

  const ratingCounts = reviews.reduce(
    (acc, review) => {
      acc[review.rating - 1]++
      return acc
    },
    [0, 0, 0, 0, 0],
  )

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  return {
    reviews: filteredReviews,
    ratingCounts,
    averageRating,
    loading,
    error,
    showPhotoOnly,
    setShowPhotoOnly,
    sortBy,
    setSortBy,
  }
}

