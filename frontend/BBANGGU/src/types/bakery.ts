export interface UserType {
  user_id: number
  name: string
  profile_image_url: string
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
  background_image_url: string
  latitude: number
  longitude: number
  created_at: string
  updated_at: string
  deleted_at?: string
  likes_count: number
  rating: number
  review_count: number
  distance: string
  hours: string
  price: number
  original_price: number
  is_liked: boolean
  bread_package: PackageType
}

