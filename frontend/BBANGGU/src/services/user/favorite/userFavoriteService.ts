import { favoritebakeryApi } from "../../../api/user/favorite/favoritebakeryApi";

export async function getFavoriteBakery() {
  try {
    const response = await favoritebakeryApi.getFavoriteBakery();
    return response.data;
  } catch (error) {
    console.error("좋아요 가게 조회 실패:", error);
    throw error;
  }
}

