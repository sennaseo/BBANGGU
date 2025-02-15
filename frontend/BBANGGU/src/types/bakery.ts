export interface UserType {
  userId: number
  name: string
  email: string
  phone: string
  role: string
  profileImageUrl: string | null
}

export interface ReviewType {
  reviewId: number
  bakeryId: number
  rating: number
  content: string
  reviewImageUrl?: string
  createdAt: string
}
// 새롭게 API의 응답 구조를 반영하는 타입을 추가합니다.
export interface PackageResponse {
  data: PackageType[]
}
export interface PackageType {
  packageId: number
  bakeryId: number
  price: number
  quantity: number
  name: string
}

export interface BakeryType {
  bakeryId: number;
  userId: number;
  name: string;
  description: string;
  businessRegistrationNumber: string;
  addressRoad: string;
  addressDetail: string;
  bakeryImageUrl: string | null;
  bakeryBackgroundImgUrl: string | null;
  star: number;
  distance: number;
  reviewCnt: number;
  is_liked: boolean;
  pickupTime: { startTime: string; endTime: string } | null;
  price: number | null;
}

// 새로운 인터페이스: 가게의 평점 정보를 위한 타입 정의
export interface BakeryRating {
  bakeryId: number;
  average: number;
  star_rating: number[];
}

export interface ReservationType {
  reservationId: number
  userId: number
  bakeryId: number
  breadPackageId: number
  quantity: number
  totalPrice: number
  reservedPickupTime: string
  pickupAt: string
  createdAt: string
  cancelledAt?: string
  status: "pending" | "cancelled" | "completed"
}

export interface EchoSaveType {
  savedMoney: number
  reducedCo2e: number
}

export interface BakerySearchItem {
  bakeryId: number;
  userId: number;
  name: string;
  description: string;
  businessRegistrationNumber: string;
  addressRoad: string;
  addressDetail: string;
  bakeryImageUrl: string;
  star: number;
  distance: number;
}

// ExtendedBakeryType을 추가하여 package 프로퍼티 포함
export interface ExtendedBakeryType extends BakeryType {
  package: PackageResponse;
  review: ReviewType[];
  averageRating: BakeryRating;
}

export interface ExtendedUserType extends UserType {
  reservation: ReservationType[];
  echosave: EchoSaveType[];
}
