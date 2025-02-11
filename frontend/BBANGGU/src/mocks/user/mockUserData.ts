import type { UserType } from "../../types/bakery"
import { mockBakeries } from "./bakeryMockData"

export const mockUsers: Record<number, UserType> = {
  101: {
    user_id: 101,
    name: "빵순이",
    profile_image_url: "https://images.unsplash.com/photo-1569346276519-709519eeaa51?q=80&w=2082&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    reservations: [],
    echosaves: [],
    favorite: [
      {
        user_id: 101,
        bakeryId: 1,
        created_at: "2024-03-01T10:00:00Z",
        bakery: {
          ...mockBakeries[0],
          is_liked: true
        }
      },
      {
        user_id: 101,
        bakeryId: 2,
        created_at: "2024-03-02T14:30:00Z",
        bakery: {
          ...mockBakeries[1],
          is_liked: true
        }
      }
    ],
  },
  102: {
    user_id: 102,
    name: "크로와상러버",
    profile_image_url: "https://example.com/user102.jpg",
    reservations: [],
    echosaves: [],
    favorite: [],
  },
  103: {
    user_id: 103,
    name: "빵덕후",
    profile_image_url: "https://example.com/user103.jpg",
    reservations: [],
    echosaves: [],
    favorite: [],
  },
  104: {
    user_id: 104,
    name: "베이커리탐험가",
    profile_image_url: "https://example.com/user104.jpg",
    reservations: [],
    echosaves: [],
    favorite: [],
  },
  105: {
    user_id: 105,
    name: "달콤한인생",
    profile_image_url: "https://example.com/user105.jpg",
    reservations: [],
    echosaves: [],
    favorite: [],
  },
  106: {
    user_id: 106,
    name: "빵집투어러",
    profile_image_url: "https://example.com/user106.jpg",
    reservations: [],
    echosaves: [],
    favorite: [],
  },
}

