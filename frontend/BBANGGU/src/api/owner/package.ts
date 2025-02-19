import instance from "../axios";
import { ApiResponse } from "../../types/api";
import axios from "axios";

// 여기에 공통으로 사용할 BreadPackage 인터페이스를 정의
export interface BreadPackage {
  packageId: number;
  bakeryId: number;
  name: string;
  price: number;
  initialQuantity: number; // 추가
  quantity: number;
  savedMoney: number;
  initial_quantity: number; // 등록 시 작성한 총 개수
  breadCategoryId?: number; // optional로 변경
  breadImageUrl?: string | null; // optional로 변경
}

export interface PackageResponse {
  message: string;
  data: BreadPackage[]; // 배열로 변경
}

interface PickupTimeResponse {
  message: string;
  data: {
    startTime: string;
    endTime: string;
  } | null;
}

interface PickupTimeUpdateRequest {
  [key: string]: {
    // 요일별 시간 설정을 위한 동적 키
    startTime: string;
    endTime: string;
  };
}

interface PackageUpdateRequest {
  bakeryId: number;
  name: string;
  price: number;
  quantity: number;
}

interface RegisterPackageRequest {
  bakeryId: number;
  name: string;
  price: number;
  quantity: number;
}

// 오늘의 빵꾸러미 조회 API
export const getBakeryPackages = async (bakeryId: number) => {
  try {
    console.log("빵꾸러미 API 호출:", {
      url: `/bread-package/bakery/${bakeryId}`, // URL 경로 수정
      bakeryId,
    });

    const response = await instance.get<PackageResponse>(
      `/bread-package/bakery/${bakeryId}`
    );

    // 응답 데이터 로깅
    console.log("빵꾸러미 API 응답:", {
      status: response.status,
      data: response.data,
      raw: response,
    });

    return response.data;
  } catch (error) {
    console.error("빵꾸러미 조회 실패:", error);
    if (axios.isAxiosError(error)) {
      console.error("API 에러 상세:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }
    throw error;
  }
};

// 빵꾸러미 등록 API 수정
export const registerPackage = async (
  data: RegisterPackageRequest
): Promise<void> => {
  try {
    console.log("빵꾸러미 등록 API 호출:", {
      url: "/bread-package",
      data,
    });

    const response = await instance.post<ApiResponse<void>>(
      "/bread-package",
      data
    );
    return response.data.data;
  } catch (error) {
    console.error("Error registering package:", error);
    throw error;
  }
};

// 픽업 시간 조회 API
export const getPickupTime = async (bakeryId: number) => {
  try {
    const response = await instance.get<PickupTimeResponse>(
      `/bakery/${bakeryId}/pickup`
    );
    console.log("픽업 시간 조회 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("픽업 시간 조회 실패:", error);
    throw error;
  }
};

// 픽업 시간 수정 API
export const updatePickupTime = async (
  bakeryId: number,
  pickupTime: PickupTimeUpdateRequest
) => {
  try {
    console.log("픽업 시간 수정 요청:", pickupTime);
    const response = await instance.put(
      `/bakery/${bakeryId}/pickup`,
      pickupTime
    );
    return response.data;
  } catch (error) {
    console.error("픽업 시간 수정 실패:", error);
    throw error;
  }
};

// 빵꾸러미 삭제 API 추가
export const deletePackage = async (packageId: number) => {
  try {
    const response = await instance.delete(`/bread-package/${packageId}`);
    return response.data;
  } catch (error) {
    console.error("빵꾸러미 삭제 실패:", error);
    throw error;
  }
};

// 빵꾸러미 수정 API 수정
export const updatePackage = async (
  packageId: number,
  packageData: PackageUpdateRequest
) => {
  try {
    console.log("수정 요청 URL:", `/bread-package/${packageId}`);
    console.log("수정 요청 데이터:", JSON.stringify(packageData, null, 2));
    console.log(
      "Authorization:",
      instance.defaults.headers.common["Authorization"]
    );

    const response = await instance.put(
      `/bread-package/${packageId}`,
      packageData
    );
    return response.data;
  } catch (error: any) {
    console.error("빵꾸러미 수정 실패:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};
