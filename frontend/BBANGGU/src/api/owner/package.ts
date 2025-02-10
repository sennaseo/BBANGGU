import axios from 'axios';
import { PackageType } from '../../types/bakery';

// ApiResponse 래퍼 제거 - API가 직접 배열을 반환하므로
export const getBakeryPackages = async (bakeryId: number): Promise<PackageType[]> => {
  try {
    const response = await axios.get<PackageType[]>(
      `/bread-package/bakery/${bakeryId}`,
      {
        // 토큰이 확실하지 않으므로 일단 제거
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        // },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};