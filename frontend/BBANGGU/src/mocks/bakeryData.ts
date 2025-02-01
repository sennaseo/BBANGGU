import type { BakeryType } from "../types/bakery"

export const mockBakeryData: Record<string, BakeryType> = {
  poksundaltal: {
    id: "poksundaltal",
    name: "폭신달달 베이커리",
    rating: 4.3,
    reviewCount: 112,
    distance: 1,
    pickupTime: "19:00 ~ 20:30",
    description:
      "주로 휘낭시에나 타르트가 담기지만, 두 가지 홧차를 믹스해 만든 베스트 메뉴 : 더블 밀크티가 담길 수 있어 좋아요 ^^",
    bannerImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%B2%A0%EC%9D%B4%EC%BB%A4%EB%A6%AC%20%EC%83%81%EC%84%B8%201-bIdksBODOc6t8jH6o5x3uHpvpUkaKT.png",
    logoImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%ED%94%84%EB%A1%9C%ED%95%84%EC%82%AC%EC%A7%84-5X5u584NhDzu6AYae4rvAo9B3sisD9.png",
    location: {
      address: "경상북도 진평동 453 (현 위치로부터 약 256m, 도보3분)",
      latitude: 35.8714,
      longitude: 128.6014,
    },
    reviews: [
      {
        id: "r1",
        rating: 5,
        content: "수플레 먹으러 다녀왔어요!! 달달구리하고 초코대로에 큰 길가에 위치한 곳이...",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%A6%AC%EB%B7%B0%20%EC%82%AC%EC%A7%84-tZmeyUv7Syj13HMJkn3kJY7PT6elS7.png",
        author: "헨젤과그랫대",
        postedAt: "34분전",
      },
      {
        id: "r2",
        rating: 5,
        content: "빵이 너무 맛있어요! 특히 크로와상이 바삭하고 겉은 바삭 속은 촉촉해요",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%B2%A0%EC%9D%B4%EC%BB%A4%EB%A6%AC%20%EC%83%81%EC%84%B8%201-bIdksBODOc6t8jH6o5x3uHpvpUkaKT.png",
        author: "빵순이123",
        postedAt: "2시간 전",
      },
    ],
  },
  sweetbread: {
    id: "sweetbread",
    name: "달콤한 빵집",
    rating: 4.5,
    reviewCount: 89,
    distance: 0.5,
    pickupTime: "18:00 ~ 19:30",
    description: "매일 아침 신선한 재료로 구워내는 달콤한 빵집입니다. 크로와상과 식빵이 인기메뉴입니다.",
    bannerImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%B2%A0%EC%9D%B4%EC%BB%A4%EB%A6%AC%20%EC%83%81%EC%84%B8%201-bIdksBODOc6t8jH6o5x3uHpvpUkaKT.png",
    logoImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%ED%94%84%EB%A1%9C%ED%95%84%EC%82%AC%EC%A7%84-5X5u584NhDzu6AYae4rvAo9B3sisD9.png",
    location: {
      address: "경상북도 중앙동 123 (현 위치로부터 약 100m, 도보1분)",
      latitude: 35.8714,
      longitude: 128.6014,
    },
    reviews: [
      {
        id: "r3",
        rating: 5,
        content: "식빵이 정말 부드럽고 맛있어요. 매일 아침 이 빵으로 시작하고 싶네요!",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%A6%AC%EB%B7%B0%20%EC%82%AC%EC%A7%84-tZmeyUv7Syj13HMJkn3kJY7PT6elS7.png",
        author: "빵덕후",
        postedAt: "1시간 전",
      },
    ],
  },
}

