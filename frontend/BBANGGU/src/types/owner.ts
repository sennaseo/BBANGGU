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