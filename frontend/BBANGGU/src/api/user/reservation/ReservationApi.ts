import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://i12d102.p.ssafy.io:8081';

interface ReservationCheckResponse {
  message: string;
  data: {
    reservationId: number;
    status: string;
  };
}

export const ReservationApi = {
  checkReservation: async (bakeryId: number, quantity: number) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      console.log('===== 예약 검증 요청 =====');
      console.log('요청 데이터:', { bakeryId, quantity });
      console.log('토큰:', accessToken?.substring(0, 10) + '...');

      const response = await axios.post<ReservationCheckResponse>(
        `${BASE_URL}/reservation/check`,
        { bakeryId, quantity },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('===== 예약 검증 응답 =====');
      console.log('응답 데이터:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('===== 예약 검증 에러 =====');
      console.error('에러 응답:', error.response?.data);
      throw error;
    }
  },

  createReservation: async (paymentData: {
    reservationId: number;
    paymentKey: string;
    orderId: string;
    amount: number;
  }) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      
      console.log('===== 예약 생성 요청 데이터 =====', {
        ...paymentData,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      const response = await axios.post(
        `${BASE_URL}/reservation`,
        paymentData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error: any) {
      console.error('===== 예약 생성 에러 =====');
      console.error('에러 응답:', error.response?.data);
      throw error;
    }
  },
}; 