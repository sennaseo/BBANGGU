export interface BakeryType {
  id: string
  name: string
  rating: number
  reviewCount: number
  distance: number
  pickupTime: string
  description: string
  bannerImage: string
  logoImage: string
  location: LocationType
  reviews: ReviewType[]
}

export interface LocationType {
  address: string
  latitude: number
  longitude: number
}

export interface ReviewType {
  id: string
  rating: number
  content: string
  image?: string
  author: string
  postedAt: string
}

export interface Store {
  id: string
  name: string
  rating: number
  reviewCount: number
  distance: string
  hours: string
  price: number
  originalPrice: number
  imageUrl: string
  isLiked: boolean
}

export interface Package {
  id: number
  title: string
  store: string
  imageUrl: string
  isLiked: boolean
}

