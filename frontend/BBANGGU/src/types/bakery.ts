export interface UserType {
  user_id: number
  username: string
  profile_image_url: string
}

export interface BakeryType {
  bakery_id: number
  user_id: number
  name: string
  description: string
  business_registration_number: string
  address_road: string
  address_detail: string
  photo_url: string
  latitude: number
  longitude: number
  created_at: string
  updated_at: string
  deleted_at?: string
  reviews: ReviewType[]
  likes_count: number
}

export interface LocationType {
  address_road: string
  address_detail: string
  latitude: number
  longitude: number
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

export interface Store {
  bakery_id: number
  name: string
  rating: number
  review_count: number
  distance: string
  hours: string
  price: number
  original_price: number
  image_url: string
  is_liked: boolean
  likes_count: number
  reviews: ReviewType[]
}

export interface Package {
  bread_package_id: number
  bakery_id: number
  bakery_name: string
  bakery_photo_url: string
  name: string
  price: number
  discount_rate: number
  quantity: number
  description: string
  created_at: string
  deleted_at?: string
  is_liked: boolean
}

