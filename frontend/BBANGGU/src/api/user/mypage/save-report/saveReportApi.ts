import axios from 'axios';
import { ApiResponse } from '../../../../types/response';
import { EchoSave } from '../../../../store/slices/echosaveSlice';
import { API_BASE_URL } from '../../../../config/env';
const BASE_URL = API_BASE_URL;

export const saveReportApi = {
  getSaveReport: async () => {
    try {
      const response = await axios.get<ApiResponse<EchoSave>>(
        `${BASE_URL}/saving`,
        {
            withCredentials: true,
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('절약 리포트 조회 실패:', error);
      throw error;
    }
  },
};
