import { mainApi } from '../../api/user/main/mainApi';
import type { BakeryType, PackageType } from '../../types/bakery';

export async function fetchBestPackages(): Promise<PackageType[]> {
  try {
    // TODO: 패키지 API 구현 후 수정
    await mainApi.getAllBakeries();
    return [];
  } catch (error) {
    console.error("베스트 패키지 조회 실패:", error);
    throw error;
  }
}

export async function fetchRecommendedStores(): Promise<BakeryType[]> {
  try {
    const response = await mainApi.getAllBakeries();
    return response.data;
  } catch (error) {
    console.error("추천 매장 조회 실패:", error);
    throw error;
  }
}

