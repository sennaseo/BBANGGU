import axios from 'axios';
import { store } from '../../../store';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface StockAnalysisResponse {
  message: string;
  data: string;
}

export const StockAnalysisApi = {
  getAnalysis: async (bakeryId: number) => {
    const accessToken = store.getState().auth.accessToken;
    
    try {
      const response = await axios.post<StockAnalysisResponse>(
        `${BASE_URL}/analyze/${bakeryId}`,
        {},  // POST 요청이지만 body는 비어있음
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
