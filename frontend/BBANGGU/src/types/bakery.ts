export interface UserType {
  user_id: number
  name: string
  profile_image_url: string
  reservations: ReservationType[]
  echosaves: EchoSaveType[]
  favorite: FavoriteBakeryType[]
}

export interface ReviewType {
  review_id: number
  user_id: number
  bakery_id: number
  rating: number
  content: string
  review_image_url?: string
  created_at: string
  deleted_at?: string
}

export interface PackageType {
  bread_package_id: number
  bakery_id: number
  name: string
  price: number
  discount_rate: number
  quantity: number
  description: string
  created_at: string
  deleted_at?: string
  reservations: ReservationType[]
}

export interface BakeryType {
  bakeryId: number;
  userId: number;
  name: string;
  description: string;
  businessRegistrationNumber: string;
  addressRoad: string;
  addressDetail: string;
  photoUrl: string | null;
  star: number;
  distance: number;
  package: PackageType[];
}

export interface ReservationType {
  reservation_id: number
  user_id: number
  bakery_id: number
  bread_package_id: number
  quantity: number
  total_price: number
  reserved_pickup_time: string
  pickup_at: string
  created_at: string
  cancelled_at?: string
  status: "pending" | "cancelled" | "completed"
}

export interface EchoSaveType {
  echosave_id: number
  user_id: number
  saved_money: number
  reduced_co2: number
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface FavoriteBakeryType {
  user_id: number
  bakery_id: number
  created_at: string
  deleted_at?: string
  bakery?: BakeryType
}
