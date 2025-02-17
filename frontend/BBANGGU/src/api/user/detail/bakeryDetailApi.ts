import axios from "axios"
import type { BakeryType } from "../../../types/bakery"
import { ApiResponse } from "../../../types/response"
import { store } from "../../../store";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const bakeryDetailApi = {
    getBakeryById: async (bakeryId: number): Promise<BakeryType>=> {
      try {
        const token = store.getState().user.token;
        let response;
        if (token) {
          response = await axios.get<ApiResponse<BakeryType>>(
            `${BASE_URL}/bakery/${bakeryId}`,
            { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          response = await axios.get<ApiResponse<BakeryType>>(
            `${BASE_URL}/bakery/${bakeryId}`,
            { withCredentials: true }
          );
        }
        return response.data.data;
      } catch (error) {
        console.error('베이커리 상세 조회 실패:', error);
        throw error;
      }
    }
}