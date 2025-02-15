import axiosInstance from '../axios_2';

interface PackageResponse {
  message: string;
  data: Array<{
    packageId: number;
    bakeryId: number;
    price: number;
    quantity: number;
    name: string;
  }>;
}

export const getBakeryPackages = async (bakeryId: number) => {
  try {
    console.log('요청 시작:', {
      url: `/bread-package/bakery/${bakeryId}`,
      headers: {
        'Authorization': axiosInstance.defaults.headers.common['Authorization']
      }
    });

    const response = await axiosInstance.get<PackageResponse>(`/bread-package/bakery/${bakeryId}`);
    
    console.log('API 원본 응답:', response);  // 전체 응답 확인
    console.log('response.data:', response.data);  // 응답 데이터 확인
    
    // ✅ response.data가 아닌 response.data.data를 반환
    return response.data;  // {message: string, data: Array<...>} 형태로 반환
  } catch (error) {
    console.error('빵꾸러미 조회 실패:', error);
    throw error;
  }
};