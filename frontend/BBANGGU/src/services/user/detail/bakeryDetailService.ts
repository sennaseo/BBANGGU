import { bakeryDetailApi } from "../../../api/user/detail/bakeryDetailApi";
import { mainApi } from "../../../api/user/main/mainApi";
import type { BakeryType, ExtendedBakeryType, PackageResponse } from "../../../types/bakery";
import { getReviewAndRating } from "../../../services/user/review/reviewService";

export async function fetchBakeryDetail(bakeryId: number): Promise<ExtendedBakeryType> {
  try {
    const bakery: BakeryType = await bakeryDetailApi.getBakeryById(bakeryId);
    let pkg: PackageResponse;
    try {
      const packageResponse = await mainApi.getPackagesByBakeryId(bakeryId);
      pkg = { data: packageResponse };
    } catch (error) {
      pkg = { data: [] };
    }
    
    const { reviews, averageRating } = await getReviewAndRating(bakeryId);
    const extendedBakery: ExtendedBakeryType = {
      ...bakery,
      package: pkg,
      review: reviews,
      averageRating: averageRating
    };

    return extendedBakery;
  } catch (error) {
    console.error("베이커리 상세 조회 실패:", error);
    throw error;
  }
}