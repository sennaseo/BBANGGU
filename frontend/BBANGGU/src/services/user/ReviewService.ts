import { mockReviews } from "../../mocks/user/reviewMockData"
import type { ReviewType } from "../../types/bakery"

export async function getReviews(bakery_id: string): Promise<ReviewType[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Filter reviews for the specific bakery
  return mockReviews.filter((review) => review.bakery_id === Number.parseInt(bakery_id))
}