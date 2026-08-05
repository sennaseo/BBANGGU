import axios from 'axios';
import { ApiResponse } from '../../../../types/response';
import { Reservation } from '../../../../store/slices/reservationSlice';
import { API_BASE_URL } from '../../../../config/env';
const BASE_URL = API_BASE_URL;

export const reservationApi = {
    getReservationsApi: async (startDate: string, endDate: string) => {
        try {
            const response = await axios.get<ApiResponse<Reservation[]>>(
                `${BASE_URL}/reservation/${startDate}/${endDate}`,
                { withCredentials: true });
            return response.data.data;
        } catch (error) {
            console.error('예약 조회 실패:', error);
            throw error;
        }
    },
    getReservationDetailApi: async (reservationId: number) => {
        try {
            const response = await axios.get<ApiResponse<Reservation>>(
                `${BASE_URL}/reservation/${reservationId}/detail`,
                { withCredentials: true });
            return response.data.data;
        } catch (error) {
            console.error('예약 상세 조회 실패:', error);
            throw error;
        }
    },
    deleteReservation: async (reservationId: number, cancelReason: string): Promise<boolean> => {
        try {
            const response = await axios.post<ApiResponse<boolean>>(
                `${BASE_URL}/reservation/cancel`,
                { reservationId, cancelReason },
                {
                    withCredentials: true,
                }
            );
            return response.data.data;
        } catch (error) {
            console.error("예약 취소 실패:", error);
            throw error;
        }
    }
}