import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface StockDateItem {
  stockId: number;
  bakeryId: number;
  breadId: number;
  breadName: string;
  quantity: number;
  date: string;
}

interface StockDateResponse {
  message: string;
  data: StockDateItem[];
}

export const StockDateApi = {
  getStocksByDate: async (bakeryId: number, date: string) => {
    const accessToken = localStorage.getItem('accessToken');
    
    try {
      const response = await axios.get<StockDateResponse>(
        `${BASE_URL}/stock/bakery/${bakeryId}/${date}/${date}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('유효하지 않은 인증 토큰입니다.');
      }
      throw error;
    }
  }
};
