import { mainApi } from '../../api/user/main/mainApi';
import type { BakeryType, PackageType, ExtendedBakeryType,BestPackageItem, BakerySearchItem } from '../../types/bakery';

// 모듈-레벨 캐시: 페이지 이동 시 재요청 방지
let cachedData: { updatedStores: ExtendedBakeryType[]; bestPackages: BestPackageItem[] } | null = null;

/**
 * UserMain 페이지의 데이터를 가져오는 함수.
 * 이미 데이터를 불러온 적이 있으면 캐시된 데이터를 반환합니다.
 */
export async function getUserMainData(): Promise<{ updatedStores: ExtendedBakeryType[]; bestPackages: BestPackageItem[] }> {
  if (cachedData) {
    return cachedData;
  }
  const data = await fetchAllBakeriesData();
  cachedData = data;
  return data;
}

/**
 * 좋아요 토글 후 캐시된 데이터를 업데이트하는 함수.
 */
export async function toggleFavoriteForUserMain(bakeryId: number): Promise<void> {
  await toggleFavorite(bakeryId);
  if (cachedData) {
    cachedData.bestPackages = cachedData.bestPackages.map((pkg) =>
      pkg.bakery.bakeryId === bakeryId ? { ...pkg, favorite: !pkg.favorite } : pkg
    );
  }
}

/**
 * 좋아요가 가장 많은 가게의 데이터를 가져오는 함수.
 */
export async function getBestFavoriteStoresData(): Promise<{ updatedStores: ExtendedBakeryType[]; bestPackages: BestPackageItem[] }> {
  // 선택 사항: 캐시를 재사용할지 결정
  return await fetchBestFavoriteStores();
}

export async function fetchAllBakeriesData(): Promise<{ updatedStores: ExtendedBakeryType[]; bestPackages: BestPackageItem[] }> {
  try {
    // 전체 베이커리 데이터 가져오기
    const response = await mainApi.getAllBakeries();
    const stores: BakeryType[] = response.data;
    // 각 베이커리별 패키지 데이터도 함께 요청
    const updatedStores: ExtendedBakeryType[] = await Promise.all(
      stores.map(async (store) => {
        let packages: PackageType[] = [];
        try {
          packages = await mainApi.getPackagesByBakeryId(store.bakeryId);
        } catch (error) {
          packages = [];
        }
        return {
          ...store,
          package: packages,
          favorite: [],
          hours: [],
          reviews: [],
        };
      })
    );
    // 베스트 패키지는 모든 패키지를 가격 내림차순 정렬한 후,
    // 각 패키지와 관련된 bakery 정보를 결합
    const allPackages: PackageType[] = updatedStores.flatMap((store) => store.package);
    const sortedPackages = [...allPackages].sort((a, b) => b.price - a.price);
    const bestPackages: BestPackageItem[] = sortedPackages.map((pkg) => {
      const bakery = updatedStores.find((store) => store.bakeryId === pkg.bakeryId)!;
      return { ...pkg, bakery, favorite: false };
    });
    return { updatedStores, bestPackages };
  } catch (error) {
    console.error("통합 베이커리 데이터 조회 실패:", error);
    throw error;
  }
}

export async function fetchBestFavoriteStores(): Promise<{ updatedStores: ExtendedBakeryType[]; bestPackages: BestPackageItem[] }> {
  try {
    // 좋아요가 가장 많은 가게 조회 API 호출
    const response = await mainApi.getFavoriteBest();
    const stores: BakeryType[] = response.data;
    // 각 가게에 대해 패키지 데이터를 조회
    const updatedStores: ExtendedBakeryType[] = await Promise.all(
      stores.map(async (store) => {
        let packages: PackageType[] = [];
        try {
          packages = await mainApi.getPackagesByBakeryId(store.bakeryId);
        } catch (error) {
          packages = [];
        }
        return {
          ...store,
          package: packages,
          favorite: [],
          hours: [],
          reviews: [],
        };
      })
    );
    // 각 베이커리의 첫 번째 패키지를 베스트 패키지로 사용 (로직은 필요에 따라 수정)
    const bestPackages: BestPackageItem[] = updatedStores
      .map((store) =>
        store.package.length > 0 ? { ...store.package[0], bakery: store, favorite: false } : null
      )
      .filter((item) => item !== null) as BestPackageItem[];
    return { updatedStores, bestPackages };
  } catch (error) {
    console.error("좋아요 베스트 가게 데이터 조회 실패:", error);
    throw error;
  }
}

// 좋아요 토글 함수
export async function toggleFavorite(bakeryId: number): Promise<void> {
  try {
    await mainApi.toggleFavorite(bakeryId);
  } catch (error) {
    console.error(`가게(${bakeryId}) 좋아요 토글 실패:`, error);
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

