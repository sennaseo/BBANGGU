import type { BakeryType } from "../types/bakery"

export const mockBakeryData: Record<number, BakeryType> = {
  1: {
    bakery_id: 1,
    user_id: 1,
    name: "폭신달달 베이커리",
    description:
      "주로 휘낭시에나 타르트가 담기지만, 두 가지 홧차를 믹스해 만든 베스트 메뉴 : 더블 밀크티가 담길 수 있어 좋아요 ^^",
    business_registration_number: "123-45-67890",
    address_road: "경상북도 진평동 453",
    address_detail: "1층",
    photo_url:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%ED%94%84%EB%A1%9C%ED%95%84%EC%82%AC%EC%A7%84-5X5u584NhDzu6AYae4rvAo9B3sisD9.png",
    latitude: 35.8714,
    longitude: 128.6014,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    likes_count: 50,
    reviews: [
      {
        review_id: 1,
        user_id: 101,
        bakery_id: 1,
        rating: 4,
        content: "정말 맛있는 빵이에요! 특히 크로와상이 훌륭했습니다.",
        created_at: "2024-03-01T10:00:00Z",
        review_image_url: "https://example.com/review1.jpg",
      },
      {
        review_id: 2,
        user_id: 102,
        bakery_id: 1,
        rating: 5,
        content: "친절한 서비스와 신선한 빵, 최고의 조합이네요!",
        created_at: "2024-03-02T14:30:00Z",
      },
      {
        review_id: 3,
        user_id: 103,
        bakery_id: 1,
        rating: 4,
        content: "매번 방문할 때마다 새로운 맛을 경험할 수 있어 좋아요.",
        created_at: "2024-03-05T09:15:00Z",
      },
    ],
  },
  2: {
    bakery_id: 2,
    user_id: 2,
    name: "달콤한 빵집",
    description: "매일 아침 신선한 재료로 구워내는 달콤한 빵집입니다. 크로와상과 식빵이 인기메뉴입니다.",
    business_registration_number: "123-45-67891",
    address_road: "경상북도 중앙동 123",
    address_detail: "2층",
    photo_url:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%ED%94%84%EB%A1%9C%ED%95%84%EC%82%AC%EC%A7%84-5X5u584NhDzu6AYae4rvAo9B3sisD9.png",
    latitude: 35.8714,
    longitude: 128.6014,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    likes_count: 75,
    reviews: [
      {
        review_id: 4,
        user_id: 104,
        bakery_id: 2,
        rating: 5,
        content: "빵이 정말 부드럽고 맛있어요! 특히 식빵이 일품입니다.",
        created_at: "2024-03-05T10:00:00Z",
      },
      {
        review_id: 5,
        user_id: 105,
        bakery_id: 2,
        rating: 4,
        content: "크로와상의 바삭함이 일품이에요. 다음에 또 방문하고 싶습니다.",
        created_at: "2024-03-06T11:30:00Z",
        review_image_url: "https://example.com/review5.jpg",
      },
    ],
  },
  3: {
    bakery_id: 3,
    user_id: 3,
    name: "비욘드문",
    description: "신선한 재료로 만든 다양한 빵을 즐겨보세요. 특히 크로와상이 인기 있습니다.",
    business_registration_number: "123-45-67892",
    address_road: "경상북도 동성로 456",
    address_detail: "1층",
    photo_url:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%ED%94%84%EB%A1%9C%ED%95%84%EC%82%AC%EC%A7%84-5X5u584NhDzu6AYae4rvAo9B3sisD9.png",
    latitude: 35.8714,
    longitude: 128.6014,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    likes_count: 60,
    reviews: [
    ],
  },
}

