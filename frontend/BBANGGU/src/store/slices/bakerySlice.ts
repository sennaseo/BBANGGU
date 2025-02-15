import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MapApi } from '../../api/user/map/MapApi';

interface PickupTime {
  startTime: string;
  endTime: string;
}

export interface BakeryInfo {
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
  pickupTime: PickupTime | null;
  price: number;
  latitude?: number;
  longitude?: number;
}

interface BakeryState {
  bakeryList: BakeryInfo[];
  loading: boolean;
  error: string | null;
}

const initialState: BakeryState = {
  bakeryList: [],
  loading: false,
  error: null,
};

export const fetchBakeryList = createAsyncThunk(
  'bakery/fetchBakeryList',
  async () => {
    console.log('fetchBakeryList 시작');
    const response = await MapApi.getBakeryList();
    console.log('받아온 가게 목록:', response.data);
    return response.data;
  }
);

const bakerySlice = createSlice({
  name: 'bakery',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBakeryList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBakeryList.fulfilled, (state, action) => {
        state.loading = false;
        state.bakeryList = action.payload;
      })
      .addCase(fetchBakeryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '가게 정보를 불러오는데 실패했습니다.';
      });
  },
});

export default bakerySlice.reducer; 