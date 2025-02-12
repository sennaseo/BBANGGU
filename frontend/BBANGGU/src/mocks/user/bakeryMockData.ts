import type { BakeryType } from "../../types/bakery"

export const mockBakeries: BakeryType[] = [
  {
    bakeryId: 1,
    user_id: 1,
    name: "폭신달달 베이커리",
    description:
      "주로 휘낭시에나 타르트가 담기지만, 두 가지 홧차를 믹스해 만든 베스트 메뉴 : 더블 밀크티가 담길 수 있어 좋아요 ^^",
    businessRegistrationNumber: "123-45-67890",
    addressRoad: "경상북도 진평동 453",
    addressDetail: "1층",
    photoUrl:
      "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backgroundImageUrl: "https://example.com/bakery1_background.jpg",
    star: 4.3,
    distance: 1.2,
  },
  {
    bakeryId: 2,
    user_id: 2,
    name: "달콤한 빵집",
    description: "매일 아침 신선한 재료로 구워내는 달콤한 빵집입니다. 크로와상과 식빵이 인기메뉴입니다.",
    businessRegistrationNumber: "123-45-67891",
    addressRoad: "경상북도 중앙동 123",
    addressDetail: "2층",
    photoUrl:
      "https://images.unsplash.com/photo-1514517521153-1be72277b32f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backgroundImageUrl: "https://example.com/bakery2_background.jpg",
    star: 4.5,
    distance: 0.8,
  },
  {
    bakeryId: 3,
    user_id: 3,
    name: "비욘드문",
    description: "신선한 재료로 만든 다양한 빵을 즐겨보세요. 특히 크로와상이 인기 있습니다.",
    businessRegistrationNumber: "123-45-67892",
    addressRoad: "경상북도 동성로 456",
    addressDetail: "1층",
    photoUrl:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    backgroundImageUrl: "https://example.com/bakery3_background.jpg",
    star: 4.5,
    distance: 0.8,
  },
]

