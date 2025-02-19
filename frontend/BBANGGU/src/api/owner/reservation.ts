import axiosInstance from '../axios';
import axios from 'axios';

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
    console.log('예약 조회 API 호출:', {
      url: `/reservation/${bakeryId}`,
      bakeryId
    });

    // 단순히 bakeryId path parameter로만 요청
    const response = await axiosInstance.get<ReservationResponse>(
      `/reservation/${bakeryId}`
    );
    
    console.log('예약 조회 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('예약 조회 실패:', error);
    if (axios.isAxiosError(error)) {
      console.error('API 에러 상세:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }
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