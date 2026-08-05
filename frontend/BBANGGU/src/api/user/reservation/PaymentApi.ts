import axios from "axios";
import { ApiResponse } from "../../../types/response";
import { API_BASE_URL } from "../../../config/env";

const BASE_URL = API_BASE_URL;

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
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.post<ReservationCheckResponse>(
        `${BASE_URL}/reservation/check`,
        { bakeryId, quantity },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("===== 예약 검증 에러 =====");
      console.error("에러 응답:", error.response?.data);
      throw error;
    }
  },

  uncheckReservation: async (reservationId: number, quantity: number) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      await axios.post<ApiResponse<boolean>>(
        `${BASE_URL}/reservation/uncheck`,
        { reservationId, quantity },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error: any) {
      console.error("에러: ", error);
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
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.post(
        `${BASE_URL}/reservation`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("===== 예약 생성 에러 =====");
      console.error("에러 응답:", error.response?.data);
      throw error;
    }
  },
};
