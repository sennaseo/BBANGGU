import axios from 'axios';
import { ApiResponse } from '../../../../types/response';
import { store } from '../../../../store';
import { Reservation } from '../../../../store/slices/reservationSlice';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const reservationApi = {
    getReservationsApi: async (startDate: string, endDate: string) => {
        try {
            const token = store.getState().auth.accessToken;
            const response = await axios.get<ApiResponse<Reservation[]>>(
                `${BASE_URL}/reservation/${startDate}/${endDate}`, 
                { withCredentials: true, 
                    headers: 
                    { Authorization: `Bearer ${token}` } });
            return response.data.data;
        } catch (error) {
            console.error('예약 조회 실패:', error);
            throw error;
        }
    },
    getReservationDetailApi: async (reservationId: number) => {
        try {
            const token = store.getState().auth.accessToken;
            const response = await axios.get<ApiResponse<Reservation>>(
                `${BASE_URL}/reservation/${reservationId}/detail`,
                { withCredentials: true,
                    headers: 
                    { Authorization: `Bearer ${token}` } });
            return response.data.data;
        } catch (error) {
            console.error('예약 상세 조회 실패:', error);
            throw error;
        }
    },
    deleteReservation: async (reservationId: number, cancelReason: string): Promise<boolean> => {
        try {
            const token = store.getState().auth.accessToken;
            const response = await axios.post<ApiResponse<boolean>>(
                `${BASE_URL}/reservation/cancel`,
                { reservationId, cancelReason },
                {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return response.data.data;
        } catch (error) {
            console.error("예약 취소 실패:", error);
            throw error;
        }
    }
}