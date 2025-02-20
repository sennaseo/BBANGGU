import type { UserType, ReservationType, EchoSaveType, ExtendedUserType } from "../../../types/bakery"
import { mypageApi } from "../../../api/user/mypage/mypageApi"

export async function getUserProfile(): Promise<ExtendedUserType[]> {
    try {
      // 전체 유저 데이터 가져오기
      const rawUserData = await mypageApi.getUsersApi();
      const rawUsers: UserType[] = Array.isArray(rawUserData) ? rawUserData : [rawUserData];

      const extendedUsers: ExtendedUserType[] = [];

      for (const user of rawUsers) {
        let reservations: ReservationType[] = [];
        let echosaves: EchoSaveType[] = [];
        try {
          reservations = await mypageApi.getReservationsApi();
          echosaves = await mypageApi.getEchoSavesApi();
        } catch {
          // 에러 발생 시 빈 배열 사용
          reservations = [];
          echosaves = [];
        }
        extendedUsers.push({ ...user, reservation: reservations, echosave: echosaves, addressDetail: "", addressRoad: "" });
      }
      return extendedUsers;
    } catch {
      throw new Error("통합 유저 데이터 조회 실패");
    }
} 