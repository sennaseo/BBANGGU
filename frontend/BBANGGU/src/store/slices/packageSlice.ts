import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BreadItem {
  name: string;
  price: number;
  count: number;
  status: 'confirmed' | 'editing';
}

export interface BreadCombination {
  breads: Record<string, number>; // { "soboroTest": 1, "redbeanTest": 2 }
  total_price: number;
}

export interface PackageState {
  items: BreadItem[];
  combinations: Array<Array<{
    breads: Record<string, number>;
    total_price: number;
  }>>;
  loading: boolean;
  error: string | null;
}

const initialState: PackageState = {
  items: [],
  combinations: [],
  loading: false,
  error: null
};

const packageSlice = createSlice({
  name: 'package',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<BreadItem[]>) => {
      state.items = action.payload;
    },
    setCombinations: (state, action: PayloadAction<PackageState['combinations']>) => {
      state.combinations = action.payload;
    },
    updateItem: (state, action: PayloadAction<BreadItem>) => {
      const index = state.items.findIndex(item => item.name === action.payload.name);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    addItem: (state, action: PayloadAction<BreadItem>) => {
      state.items.push(action.payload);
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.name !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { 
  setItems, 
  setCombinations,
  updateItem, 
  addItem, 
  deleteItem,
  setLoading,
  setError
} = packageSlice.actions;

export default packageSlice.reducer; 