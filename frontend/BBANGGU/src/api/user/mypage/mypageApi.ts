import axios from 'axios';
import { ApiResponse } from '../../../types/response';
import type { UserType, ReservationType, EchoSaveType } from '../../../types/bakery';
import { store } from '../../../store';
import { API_BASE_URL } from '../../../config/env';

const BASE_URL = API_BASE_URL;

export const mypageApi = {
    getUsersApi: async () => {
      try {
        const token = store.getState().auth.accessToken;
        const response = await axios.get<ApiResponse<UserType[]>>(
          `${BASE_URL}/user`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data.data;
      } catch (error) {
        console.error('유저 조회 실패:', error);
        throw error;
      }
    },

    getReservationsApi: async () => {
      try {
        const token = store.getState().auth.accessToken;

        // 오늘 날짜를 yyyy-mm-dd 형식으로 생성
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        const formattedDate = `${yyyy}-${mm}-${dd}`;
        
        const response = await axios.get<ApiResponse<ReservationType[]>>(
          `${BASE_URL}/reservation/${formattedDate}/${formattedDate}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        console.log("예약 데이터", response.data.data);
        return response.data.data;
      } catch (error) {
        console.error('예약 목록 조회 실패:', error);
        throw error;
      }
    },

    getEchoSavesApi: async () => {
      try {
        const token = store.getState().auth.accessToken;
        const response = await axios.get<ApiResponse<EchoSaveType[]>>(
          `${BASE_URL}/saving`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("절약 데이터", response.data.data);
        return response.data.data;
      } catch (error) {
        console.error('절약 데이터 조회 실패:', error);
        throw error;
      }
    },
    
    getCompletedReservationsCountApi: async () => {
      try {
        const token = store.getState().auth.accessToken;
    
        // ✅ 백엔드에서 "COMPLETED" 상태의 예약 개수 반환하는 API 호출
        const response = await axios.get<ApiResponse<{ count: number }>>(
          `${BASE_URL}/reservation/user/total`, 
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        
        console.log("완료된 예약 개수:", response.data.data);
        return response.data.data;
      } catch (error) {
        console.error('완료된 예약 개수 조회 실패:', error);
        throw error;
      }
    },
}

