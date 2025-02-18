import axios from 'axios';
import { store } from '../../../store';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://i12d102.p.ssafy.io:8081';

interface BakeryLocation {
  bakeryId: number;
  name: string;
  latitude: number;
  longitude: number;
}

export const MapApi = {
  getAllBakeries: async (): Promise<BakeryLocation[]> => {
    try {
      const response = await axios.get<BakeryLocation[]>(`${BASE_URL}/bakery/map`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error('베이커리 위치 조회 실패:', error);
      throw new Error('베이커리 위치를 불러오는데 실패했습니다.');
    }
  },
  getBakeryList: async () => {
    try {
      const accessToken = store.getState().auth.accessToken;
      
      // 1. 가게 위치 정보 조회
      const locationResponse = await axios.get(`${BASE_URL}/bakery/map`);
      const locationData = locationResponse.data;
      
      // 2. 가게 상세 정보 조회
      const detailResponse = await axios.get(`${BASE_URL}/bakery`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      const detailData = detailResponse.data.data;
      
      // 3. 두 데이터 합치기
      const combinedData = detailData.map((bakery: any) => {
        const locationInfo = locationData.find(
          (loc: { bakeryId: number }) => loc.bakeryId === bakery.bakeryId
        );
        return {
          ...bakery,
          latitude: locationInfo?.latitude,
          longitude: locationInfo?.longitude
        };
      });

      return { data: combinedData };
    } catch (error) {
      console.error('가게 정보 조회 실패:', error);
      throw error;
    }
  }
};