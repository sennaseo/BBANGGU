import { reservationApi } from "../../../../api/user/mypage/reservation/reservationApi";

export const reservationService = {
    getReservations: async (startDate: string, endDate: string) => {
        try {
            const response = await reservationApi.getReservationsApi(startDate, endDate);
            return response;
        } catch (error) {
            console.error('예약 조회 실패:', error);
            throw error;
        }
    }
}
