import axios from 'axios';
import { API_BASE_URL } from '../../../config/env';

const BASE_URL = API_BASE_URL;

type Period = 'day' | 'week' | 'month' | 'year';

interface StockTop3Response {
  message: string;
  data: {
    total: number;
    top3: [string, number][]; // [bread_name, quantity][]
  }
}

export const StockTop3Api = {
  getTop3Stocks: async (bakeryId: number, period: Period): Promise<StockTop3Response> => {
    
    try {
      const response = await axios.get<StockTop3Response>(
        `${BASE_URL}/stock/bakery/${bakeryId}/top3/${period}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('유효하지 않은 인증 토큰입니다.');
      }
      throw error;
    }
  }
}; 