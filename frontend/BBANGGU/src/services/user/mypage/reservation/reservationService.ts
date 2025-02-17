import { reservationApi } from "../../../../api/user/mypage/reservation/reservationApi";

export const getReservations = async (startDate: string, endDate: string) => {
        try {
            const response = await reservationApi.getReservationsApi(startDate, endDate);
            return response;
        } catch (error) {
            console.error('예약 조회 실패:', error);
            throw error;
        }
}

export const getReservationDetail = async (reservationId: number) => {
    try {
        const response = await reservationApi.getReservationDetailApi(reservationId);
        return response;
        } catch (error) {
            console.error('예약 상세 조회 실패:', error);
            throw error;
        }
    }

export async function deleteReservation(reservationId: number, cancelReason: string): Promise<boolean> {
    try {
        const response = await reservationApi.deleteReservation(reservationId, cancelReason);
        console.log("reservationId", reservationId)
        console.log("cancelReason", cancelReason)
        return response;
    } catch (error) {
        console.error('예약 취소 실패:', error);
        throw error;
    }
}

