export interface UserType {
  user_id: number
  name: string
  profile_image_url: string
}

export interface ReviewType {
  review_id: number
  user_id: number
  bakeryId: number
  rating: number
  content: string
  review_image_url?: string
  created_at: string
  deleted_at?: string
}

export interface PackageType {
  packageId: number
  bakeryId: number
  price: number
  discountRate: number
  quantity: number
  name: string
  description: string
}

export interface BakeryType {
  bakeryId: number;
  user_id: number;
  name: string;
  description: string;
  businessRegistrationNumber: string;
  addressRoad: string;
  addressDetail: string;
  photoUrl: string | null;
  star: number;
  distance: number;
}

export interface ReservationType {
  reservation_id: number
  user_id: number
  bakeryId: number
  bread_packageId: number
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
  bakeryId: number
  created_at: string
  deleted_at?: string
}

export interface ExtendedBakeryType extends BakeryType {
  package: PackageType[];
  favorite: FavoriteBakeryType[];
  hours: ReservationType[];
  reviews: ReviewType[];
}

export interface BestPackageItem extends PackageType {
  bakery: BakeryType;
  favorite: boolean;
}

export interface BakerySearchItem {
  bakeryId: number;
  userId: number;
  name: string;
  description: string;
  businessRegistrationNumber: string;
  addressRoad: string;
  addressDetail: string;
  photoUrl: string;
  star: number;
  distance: number;
}
