import axios from 'axios';

interface BakeryLocation {
  bakeryId: number;
  name: string;
  latitude: number;
  longitude: number;
}

export const MapApi = {
  getAllBakeries: async (): Promise<BakeryLocation[]> => {
    try {
      const response = await axios.get<BakeryLocation[]>('/bakery/map', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('베이커리 위치 조회 실패:', error);
      throw new Error('베이커리 위치를 불러오는데 실패했습니다.');
    }
  }
};