import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface MonthlyStockItem {
  breadId: number;
  quantity: number;
}

interface MonthlyStockResponse {
  message: string;
  data: {
    [key: string]: MonthlyStockItem[]; // 월별 재고 데이터
  }
}

interface WeeklyStockItem {
  date: string;
  totalQuantity: number;
}

interface WeeklyStockResponse {
  message: string;
  data: WeeklyStockItem[];
}

interface DailyStockItem {
  stockId: number;
  bakeryId: number;
  breadId: number;
  breadName: string;
  quantity: number;
  date: string;
}

interface StockDailyResponse {
  message: string;
  data: DailyStockItem[];
}

export const StockChartApi = {
  getYearlyStock: async (bakeryId: number) => {
    const accessToken = localStorage.getItem('accessToken');
    
    try {
      const response = await axios.get<MonthlyStockResponse>(
        `${BASE_URL}/stock/bakery/${bakeryId}/year`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('인증이 필요합니다.');
      }
      throw error;
    }
  },

  getWeeklyStock: async (bakeryId: number) => {
    const accessToken = localStorage.getItem('accessToken');
    
    try {
      const response = await axios.get<WeeklyStockResponse>(
        `${BASE_URL}/stock/bakery/${bakeryId}/week`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('인증이 필요합니다.');
      }
      throw error;
    }
  },

  getDailyStocks: async (bakeryId: number) => {
    const accessToken = localStorage.getItem('accessToken');
    
    try {
      const response = await axios.get<StockDailyResponse>(
        `${BASE_URL}/stock/bakery/${bakeryId}/day`,
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
