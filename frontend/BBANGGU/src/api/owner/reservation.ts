import axiosInstance from '../axios';

// ReservationStatus 타입 정의 수정
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'EXPIRED' | 'COMPLETED';

// ReservationInfo 인터페이스도 export 추가
export interface ReservationInfo {
  reservationId: number;
  name: string;
  profileImageUrl: string | null;
  phone: string;
  paymentTime: string;
  status: ReservationStatus;
  quantitiy: number;
  cancelReason?: string;
}

// 내부적으로 사용할 API 응답용 인터페이스 추가
interface APIReservationInfo {
  name: string;
  profileImageUrl: string | null;
  phone: string;
  paymentTime: string;
  status: ReservationStatus;
  quantitiy: number;
  cancelReason?: string;
  reservationId: number;
}

interface ReservationResponse {
  message: string;
  data: {
    infos: APIReservationInfo[];
    totalNum: number;
    endTime: string;
  };
}

// 새로운 픽업 완료 응답 타입 정의
interface PickupCompleteResponse {
  message: string;
  data: {
    reservationId: number;
    pending: number;
    status: ReservationStatus;
  };
}

interface CancelResponse {
  message: string;
  data: {
    reservationId: number;
    status: ReservationStatus;
  };
}

export const getTodayReservations = async (bakeryId: number) => {
  try {
    // 오늘 날짜의 시작과 끝 시간 계산
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // ISO 문자열 형식을 서버가 기대하는 형식으로 변경
    const startDate = today.toISOString().split('T')[0] + 'T00:00:00.000Z';
    const endDate = tomorrow.toISOString().split('T')[0] + 'T00:00:00.000Z';

    console.log('API 요청 정보:', {
      url: `/reservation/${bakeryId}`,
      params: {
        startDate,
        endDate
      }
    });

    const response = await axiosInstance.get<ReservationResponse>(
      `/reservation/${bakeryId}`,
      {
        params: {
          bakeryId,
          startDate,
          endDate
        }
      }
    );
    
    console.log('API 응답 전체:', response);
    return response.data;
  } catch (error) {
    console.error('예약 조회 실패 상세:', error);
    throw error;
  }
};

// 픽업 완료 API
export const completePickup = async (reservationId: number) => {
  try {
    const response = await axiosInstance.put<PickupCompleteResponse>(
      `/reservation/pickup/${reservationId}`
    );
    return response.data;
  } catch (error) {
    console.error('픽업 완료 처리 실패:', error);
    throw error;
  }
};

// 예약 취소 API
export const cancelReservation = async (data: { reservationId: number; cancelReason: string }) => {
  try {
    console.log('취소 요청 데이터:', data);
    const response = await axiosInstance.post<CancelResponse>('/reservation/cancel', data);
    console.log('취소 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('예약 취소 실패:', error);
    throw error;
  }
}; 