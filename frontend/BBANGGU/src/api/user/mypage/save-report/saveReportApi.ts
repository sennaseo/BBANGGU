import axios from 'axios';
import { ApiResponse } from '../../../../types/response';
import { store } from '../../../../store';
import { EchoSave } from '../../../../store/slices/echosaveSlice';
// const BASE_URL = 'http://127.0.0.1:8080';
// const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://13.124.56.79:8081';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const saveReportApi = {
  getSaveReport: async () => {
    try {
      const token = store.getState().user.token;
      const response = await axios.get<ApiResponse<EchoSave>>(
        `${BASE_URL}/saving`,
        {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('절약 리포트 조회 실패:', error);
      throw error;
    }
  },
};
