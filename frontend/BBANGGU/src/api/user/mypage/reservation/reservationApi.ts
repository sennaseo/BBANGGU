import axios from 'axios';
import { ApiResponse } from '../../../../types/response';
import type { ReservationType } from '../../../../types/bakery';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const reservationApi = {
    getReservationsApi: async (startDate: string, endDate: string) => {
        try {
            const token = localStorage.getItem("accessToken") || import.meta.env.VITE_MOCK_ACCESS_TOKEN || "";
            const response = await axios.get<ApiResponse<ReservationType[]>>(
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
            const token = localStorage.getItem("accessToken") || import.meta.env.VITE_MOCK_ACCESS_TOKEN || "";
            const response = await axios.get<ApiResponse<ReservationType>>(
                `${BASE_URL}/reservation/${reservationId}/detail`,
                { withCredentials: true,
                    headers: 
                    { Authorization: `Bearer ${token}` } });
            return response.data.data;
        } catch (error) {
            console.error('예약 상세 조회 실패:', error);
            throw error;
        }
    }
    
}