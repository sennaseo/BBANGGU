import axios from 'axios';
import { ApiResponse } from '../../../../types/response';
import { store } from '../../../../store';
import { EchoSave } from '../../../../store/slices/echosaveSlice';
import { API_BASE_URL } from '../../../../config/env';
const BASE_URL = API_BASE_URL;

export const saveReportApi = {
  getSaveReport: async () => {
    try {
      const token = store.getState().auth.accessToken;
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
