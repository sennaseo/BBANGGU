import axios from 'axios';
import { ApiResponse } from '../../../types/response';
import { BakeryType } from '../../../types/bakery';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080';

export const mainApi = {
  getAllBakeries: async () => {
    try {
      const response = await axios.get<ApiResponse<BakeryType[]>>(`${BASE_URL}/bakery/1`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('베이커리 목록 조회 실패:', error);
      throw error;
    }
  }
}; 