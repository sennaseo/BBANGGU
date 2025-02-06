import { atom } from 'recoil';

export interface BreadItem {
  id: number;
  name: string;
  count: number;
  price: number;
  status: 'confirmed' | 'editing' | 'pending';
}

export const packageItemsState = atom<BreadItem[]>({
  key: 'packageItemsState',
  default: []
}); 