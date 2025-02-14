import { mainApi } from '../../api/user/main/mainApi';
import type { BakeryType, BakerySearchItem, PackageResponse, ExtendedBakeryType } from '../../types/bakery';
import { getAverageRating } from '../user/review/reviewService';
// 모듈-레벨 캐시: 페이지 이동 시 재요청 방지
let cachedData: { allbakery: ExtendedBakeryType[] } | null = null;

/**
 * UserMain 페이지의 데이터를 가져오는 함수.
 * 이미 데이터를 불러온 적이 있으면 캐시된 데이터를 반환합니다.
 */
export async function getUserMainData(): Promise<{ allbakery: ExtendedBakeryType[] }> {
  if (cachedData) {
    return cachedData;
  }
  const data = await fetchAllBakeriesData();
  cachedData = data;
  return data;
}

/**
 * 좋아요가 가장 많은 가게의 데이터를 가져오는 함수.
 */
export async function getBestFavoriteStoresData(): Promise<{ favoritebakery: BakeryType[] }> {
  // 선택 사항: 캐시를 재사용할지 결정
  return await fetchBestFavoriteStores();
}

export async function fetchAllBakeriesData(): Promise<{ allbakery: ExtendedBakeryType[] }> {
  try {
    // 전체 베이커리 데이터 가져오기
    const response = await mainApi.getAllBakeries();
    const stores: BakeryType[] = response.data;
    // 각 베이커리별 패키지 데이터를 포함하여 ExtendedBakeryType 배열로 변환합니다.
    const allbakery: ExtendedBakeryType[] = await Promise.all(
      stores.map(async (store: BakeryType): Promise<ExtendedBakeryType> => {
        let packages: PackageResponse;
        try {
          const packageResponse = await mainApi.getPackagesByBakeryId(store.bakeryId);
          packages = { data: packageResponse };
        } catch (error) {
          packages = { data: [] };
        }
        const averageRating = await getAverageRating(store.bakeryId);
        return { ...store, package: packages, review: [], averageRating: averageRating };
      })
    );
    return { allbakery };
  } catch (error) {
    console.error("통합 베이커리 데이터 조회 실패:", error);
    throw error;
  }
} 

export async function fetchBestFavoriteStores(): Promise<{ favoritebakery: ExtendedBakeryType[] }> {
  try {
    const response = await mainApi.getFavoriteBest();
    const stores: BakeryType[] = response.data;

    const favoritebakery: ExtendedBakeryType[] = await Promise.all(
      stores.map(async (store: BakeryType): Promise<ExtendedBakeryType> => {
        let packages: PackageResponse;
        try {
          const packageResponse = await mainApi.getPackagesByBakeryId(store.bakeryId);
          packages = { data: packageResponse };
        } catch (error) {
          packages = { data: [] };
        }
        const averageRating = await getAverageRating(store.bakeryId);
        return { ...store, package: packages, review: [], averageRating: averageRating };
      })
    );
    return { favoritebakery };
  } catch (error) {
    console.error("좋아요 베스트 가게 데이터 조회 실패:", error);
    throw error;
  }
} 

import { searchBakery as searchBakeryApi } from '../../api/user/main/mainApi';

/**
 * 가게 검색 API 호출 및 응답 데이터 가공 함수.
 * @param keyword 검색어
 * @returns BakerySearchItem 배열
 */
export async function searchBakery(keyword: string): Promise<BakerySearchItem[]> {
  const response = await searchBakeryApi(keyword);
  // 응답 구조: { message: string, data: { content: BakerySearchItem[], ... } }
  return response.data.content as BakerySearchItem[];
}

/**
 * 통합 좋아요 토글 함수: 현재 좋아요 상태(isLiked)에 따라 좋아요 추가 또는 삭제 API 호출
 * @param bakeryId 베이커리 ID
 * @param is_liked 현재 좋아요 상태 (true면 삭제, false면 추가)
 * @returns API 호출 결과 (boolean 값)
 */
export async function toggleFavoriteForUser(bakeryId: number, is_liked: boolean): Promise<boolean> {
  if (is_liked) {
    // 현재 좋아요 상태이면 삭제 API 호출
    return await mainApi.deleteFavorite(bakeryId);
  } else {
    // 좋아요 상태가 아니면 추가 API 호출
    return await mainApi.toggleFavorite(bakeryId);
  }
}

