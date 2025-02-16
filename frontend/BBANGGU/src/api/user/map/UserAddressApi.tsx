import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://i12d102.p.ssafy.io:8081';

interface AddressUpdateRequest {
  addressRoad: string;
  addressDetail: string;
}

interface ApiResponse {
  message: string;
  data: null;
}

export const UserAddressApi = {
  updateAddress: async (addressData: AddressUpdateRequest): Promise<ApiResponse> => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      console.log('===== 주소 업데이트 요청 시작 =====');
      console.log('토큰:', accessToken?.substring(0, 10) + '...');  // 보안을 위해 일부만 출력
      console.log('요청 URL:', `${BASE_URL}/user/update`);
      console.log('요청 데이터:', addressData);
      console.log('요청 헤더:', {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken?.substring(0, 10)}...`
      });

      if (!accessToken) {
        throw new Error('로그인이 필요합니다.');
      }

      try {
        const response = await axios.patch<ApiResponse>(
          `${BASE_URL}/user/update`,
          addressData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );

        console.log('===== 응답 정보 =====');
        console.log('응답 상태:', response.status);
        console.log('응답 헤더:', response.headers);
        console.log('응답 데이터:', response.data);
        
        return response.data;
      } catch (axiosError: any) {
        console.log('===== axios 에러 정보 =====');
        console.log('에러 응답:', axiosError.response);
        console.log('에러 요청:', axiosError.request);
        console.log('에러 설정:', axiosError.config);
        throw axiosError;
      }
    } catch (error: any) {
      console.log('===== 최종 에러 정보 =====');
      if (error.response) {
        const { status, data } = error.response;
        console.log('에러 상태:', status);
        console.log('에러 데이터:', data);
        
        if (status === 401) {
          throw new Error(data.message || '로그인이 필요합니다.');
        } else if (status === 400) {
          throw new Error(data.message || '잘못된 요청입니다.');
        } else if (status === 409) {
          throw new Error(data.message);
        }
      }
      console.log('기타 에러:', error);
      throw new Error('주소 업데이트에 실패했습니다.');
    }
  }
};