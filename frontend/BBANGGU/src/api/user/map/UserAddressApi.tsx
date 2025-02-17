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
      
      if (!accessToken) {
        throw new Error('로그인이 필요합니다.');
      }

      // FormData 구성
      const formData = new FormData();
      
      // 주소 데이터를 문자열로 변환
      const addressJson = {
        addressRoad: addressData.addressRoad,
        addressDetail: addressData.addressDetail
      };

      // Text 형식으로 추가
      formData.append('user', new Blob([JSON.stringify(addressJson)], {
        type: 'application/json'
      }));

      console.log('전송 데이터 확인:', {
        formData_entries: Array.from(formData.entries()),
        address_data: addressJson
      });

      try {
        const response = await axios.patch<ApiResponse>(
          `${BASE_URL}/user/update`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        console.log('API 응답 성공:', response.data);
        return response.data;

      } catch (axiosError: any) {
        console.error('API 요청 실패:', {
          상태: axiosError.response?.status,
          데이터: axiosError.response?.data,
          전송된_데이터: Array.from(formData.entries()),
          요청_헤더: axiosError.config?.headers
        });
        throw axiosError;
      }

    } catch (error: any) {
      console.error('최종 에러:', {
        종류: error.constructor.name,
        메시지: error.message,
        응답: error.response?.data
      });
      throw new Error(error.response?.data?.message || '주소 업데이트에 실패했습니다.');
    }
  }
};