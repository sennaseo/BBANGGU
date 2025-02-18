import { createSlice } from '@reduxjs/toolkit';

export interface ReviewType {
    reviewId: number;
    reservationId: number;
    userId: number;
    bakeryId: number;
    rating: number;
    content: string;
    reviewImageUrl: string;
    createdAt: string;
}

export interface ReviewState {
    reviews: ReviewType[];
    loading: boolean;
    error: string | null;
}

const initialState: ReviewState = {
    reviews: [],
    loading: false,
    error: null
}

const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        setReviews: (state, action) => {
            state.reviews = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
})

export default reviewSlice.reducer;