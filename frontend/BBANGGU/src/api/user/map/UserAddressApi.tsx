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
      
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 401) {
          throw new Error('로그인이 필요합니다.');
        } else if (status === 400) {
          throw new Error('잘못된 요청입니다.');
        } else if (status === 409) {
          throw new Error(data.message);
        }
      }
      throw new Error('주소 업데이트에 실패했습니다.');
    }
  }
};