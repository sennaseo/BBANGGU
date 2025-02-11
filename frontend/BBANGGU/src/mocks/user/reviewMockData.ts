import type { ReviewType } from "../../types/bakery"

export const mockReviews: ReviewType[] = [
  {
    review_id: 1,
    user_id: 101,
    bakeryId: 1,
    rating: 4,
    content: "정말 맛있는 빵이에요! 특히 크로와상이 훌륭했습니다.",
    created_at: "2024-03-01T10:00:00Z",
    review_image_url: "https://images.unsplash.com/photo-1516919549054-e08258825f80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    review_id: 2,
    user_id: 102,
    bakeryId: 1,
    rating: 5,
    content: "친절한 서비스와 신선한 빵, 최고의 조합이네요!",
    created_at: "2024-03-02T14:30:00Z",
  },
  {
    review_id: 3,
    user_id: 103,
    bakeryId: 1,
    rating: 4,
    content: "매번 방문할 때마다 새로운 맛을 경험할 수 있어 좋아요.",
    created_at: "2024-03-05T09:15:00Z",
  },
  {
    review_id: 4,
    user_id: 104,
    bakeryId: 2,
    rating: 5,
    content: "빵이 정말 부드럽고 맛있어요! 특히 식빵이 일품입니다.",
    created_at: "2024-03-05T10:00:00Z",
  },
  {
    review_id: 5,
    user_id: 105,
    bakeryId: 2,
    rating: 4,
    content: "크로와상의 바삭함이 일품이에요. 다음에 또 방문하고 싶습니다.",
    created_at: "2024-03-06T11:30:00Z",
    review_image_url: "https://images.unsplash.com/photo-1516919549054-e08258825f80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    review_id: 6,
    user_id: 106,
    bakeryId: 3,
    rating: 5,
    content: "다양한 종류의 빵이 있어서 좋았어요! 특히 크로와상이 맛있습니다.",
    created_at: "2024-03-08T15:00:00Z",
  },
  {
    review_id: 7,
    user_id: 101,
    bakeryId: 3,
    rating: 4,
    content: "빵의 퀄리티가 정말 높아요. 가격은 조금 있지만 그만한 가치가 있습니다.",
    created_at: "2024-03-09T16:45:00Z",
    review_image_url: "https://images.unsplash.com/photo-1516919549054-e08258825f80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
]

