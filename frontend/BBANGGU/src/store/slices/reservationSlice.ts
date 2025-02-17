import { createSlice } from '@reduxjs/toolkit';

export interface Reservation {
    reservationId: number;
    createdAt: string;
    status: string;
    price: number;
    pickupAt: string;
    bakeryId: number;
    userId: number;
    reviewStatus: string;
    reviewId: number;
    bakeryName: string;
    packageName: string;
    quantity: number;
    
}

export interface ReservationState {
    reservations: Reservation[];
    loading: boolean;
    error: string | null;
}


const initialState: ReservationState = {
    reservations: [],
    loading: false,
    error: null
}


const reservationSlice = createSlice({
    name: 'reservation',
    initialState,
    reducers: {
        setReservations: (state, action) => {
            state.reservations = action.payload;
        }
    }
})




export default reservationSlice.reducer;