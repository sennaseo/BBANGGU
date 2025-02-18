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
    data: ReviewType[];
}

const initialState: ReviewState = {
    data: []
}

const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        setReviews: (state, action) => {
            state.data = action.payload;
        },
    }
})

export default reviewSlice.reducer;