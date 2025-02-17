import { mainApi } from '../../api/user/main/mainApi';
import type { BakerySearchItem } from '../../types/bakery';
import type { BakeryInfo } from '../../store/slices/bakerySlice';

export async function fetchAllBakeriesData(): Promise<{ allbakery: BakeryInfo[] }> {
  try {
    // 전체 베이커리 데이터 가져오기
    const response = await mainApi.getAllBakeries();
    const stores: BakeryInfo[] = response.data;
    // 각 베이커리별 패키지 데이터를 포함하여 ExtendedBakeryType 배열로 변환합니다.
    const allbakery: BakeryInfo[] = await Promise.all(
      stores.map(async (store: BakeryInfo): Promise<BakeryInfo> => {
        return store;
      })
    );
    return { allbakery };
  } catch (error) {
    console.error("통합 베이커리 데이터 조회 실패:", error);
    throw error;
  }
} 

export async function fetchBestFavoriteStores(): Promise<{ favoritebakery: BakeryInfo[] }> {
  try {
    const response = await mainApi.getFavoriteBest();
    const stores: BakeryInfo[] = response.data;

    const favoritebakery: BakeryInfo[] = await Promise.all(
      stores.map(async (store: BakeryInfo): Promise<BakeryInfo> => {
        return store;
      })
    );
    return { favoritebakery };
  } catch (error) {
    console.error("좋아요 베스트 가게 데이터 조회 실패:", error);
    throw error;
  }
} 


/**
 * 가게 검색 API 호출 및 응답 데이터 가공 함수.
 * @param keyword 검색어
 * @returns BakerySearchItem 배열
 */
export async function searchBakery(keyword: string): Promise<BakerySearchItem[]> {
  const response = await mainApi.searchBakery(keyword);
  // 응답 구조: { message: string, data: { content: BakerySearchItem[], ... } }
  return response.data as BakerySearchItem[];
}

/**
 * 통합 좋아요 토글 함수: 현재 좋아요 상태(isLiked)에 따라 좋아요 추가 또는 삭제 API 호출
 * @param bakeryId 베이커리 ID
 * @param isLiked 현재 좋아요 상태 (true면 삭제, false면 추가)
 * @param accessToken 사용자의 accessToken
 * @returns API 호출 결과 (boolean 값)
 */
export async function toggleFavoriteForUser(bakeryId: number, isLiked: boolean): Promise<boolean> {
  if (isLiked) {
    // 현재 좋아요 상태이면 삭제 API 호출
    return mainApi.deleteFavorite(bakeryId);
  } else {
    // 좋아요 상태가 아니면 추가 API 호출
    return mainApi.toggleFavorite(bakeryId);
  }
}
