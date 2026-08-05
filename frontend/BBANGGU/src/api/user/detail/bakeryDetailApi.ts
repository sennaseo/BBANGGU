import axios from "axios"
import type { BakeryType } from "../../../types/bakery"
import { ApiResponse } from "../../../types/response"
import { API_BASE_URL } from "../../../config/env";

const BASE_URL = API_BASE_URL;

export const bakeryDetailApi = {
    getBakeryById: async (bakeryId: number): Promise<BakeryType>=> {
      try {
        const response = await axios.get<ApiResponse<BakeryType>>(
          `${BASE_URL}/bakery/${bakeryId}`,
          { withCredentials: true }
        );
        return response.data.data;
      } catch (error) {
        console.error('베이커리 상세 조회 실패:', error);
        throw error;
      }
    }
}