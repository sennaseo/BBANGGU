import { mainApi } from "../../../api/user/main/mainApi";

export async function getFavoriteBakery() {
  try {
    const response = await mainApi.getFavoriteBakery();
    return response;
  } catch (error) {
    console.error("좋아요 가게 조회 실패:", error);
    throw error;
  }
}

