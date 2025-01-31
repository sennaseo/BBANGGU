import type { Store, Package } from "../types/bakery"
import { mockBakeryData } from "./bakeryData"

export const mockBestPackages: Package[] = [
  {
    bread_package_id: 1,
    bakery_id: 1,
    bakery_name: "폭신달달 베이커리",
    bakery_photo_url: "https://example.com/bakery1.jpg",
    name: "소중한 빵꾸러미",
    price: 8000,
    discount_rate: 0.5,
    quantity: 3,
    description: "인기 있는 빵 3종으로 구성된 패키지입니다.",
    created_at: "2024-01-01T00:00:00Z",
    is_liked: false,
  },
  {
    bread_package_id: 2,
    bakery_id: 2,
    bakery_name: "달콤한 빵집",
    bakery_photo_url: "https://example.com/bakery2.jpg",
    name: "오후의 빵꾸러미",
    price: 10000,
    discount_rate: 0.5,
    quantity: 4,
    description: "오후에 즐기기 좋은 빵 4종으로 구성된 패키지입니다.",
    created_at: "2024-01-01T00:00:00Z",
    is_liked: true,
  },
  {
    bread_package_id: 3,
    bakery_id: 3,
    bakery_name: "비욘드문",
    bakery_photo_url: "https://example.com/bakery3.jpg",
    name: "초코초코 꾸러미",
    price: 12000,
    discount_rate: 0.5,
    quantity: 5,
    description: "초코 lovers를 위한 빵 5종으로 구성된 패키지입니다.",
    created_at: "2024-01-01T00:00:00Z",
    is_liked: false,
  },
]

export const mockRecommendedStores: Store[] = Object.values(mockBakeryData).map((bakery) => ({
  bakery_id: bakery.bakery_id,
  name: bakery.name,
  rating: bakery.reviews.reduce((sum, review) => sum + review.rating, 0) / bakery.reviews.length,
  review_count: bakery.reviews.length,
  distance: "1km", // 예시 거리, 실제로는 계산 필요
  hours: "픽업시간 19:00 ~ 20:30", // 예시 시간, 실제 데이터 필요
  price: 5000, // 예시 가격, 실제 데이터 필요
  original_price: 10000, // 예시 원래 가격, 실제 데이터 필요
  image_url: bakery.photo_url,
  is_liked: false, // 기본값, 실제로는 사용자별로 다를 수 있음
  likes_count: bakery.likes_count,
  reviews: bakery.reviews,
}))