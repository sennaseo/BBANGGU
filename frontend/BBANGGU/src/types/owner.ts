export interface Customer {
  id: number;
  name: string;
  email: string;
  paymentTime: string;
  isPickedUp: boolean;
  breadCount: number;
}

export interface BreadPackage {
  packageId: number;
  bakeryId: number;
  price: number;
  quantity: number;
  name: string;
}

export interface ProfileSectionProps {
  userInfo: {
    name: string;
    profilePhotoUrl: string | null;
    email?: string;
    phone?: string;
  };
}