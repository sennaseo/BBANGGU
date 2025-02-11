import { mockReviews } from "../../mocks/user/reviewMockData"
import type { ReviewType } from "../../types/bakery"

export async function getReviews(bakeryId: string): Promise<ReviewType[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Filter reviews for the specific bakery
  return mockReviews.filter((review) => review.bakeryId === Number.parseInt(bakeryId))
}