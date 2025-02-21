import { TicketShape } from "../../../components/user/mypage/TicketShape";
import { MenuGrid } from "../../../components/user/mypage/MenuGrid";
import { StatsCards } from "../../../components/user/mypage/StatsCards";
import { Bell, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import UserBottomNavigation from "../../../components/user/navigations/bottomnavigation/UserBottomNavigation";
import { getUserProfile } from "../../../services/user/mypage/usermypageServices";
import { logout } from "../../../api/common/logout/logoutApi";
import { useDispatch, useSelector } from "react-redux";
import {
  logout as authLogout,
  removeLocalStorage,
} from "../../../store/slices/authSlice";
import { clearUserInfo, setUserInfo } from "../../../store/slices/userSlice";
import { LogoutModal } from "../../../components/user/mypage/LogoutModal";
import { RootState } from "../../../store";
import { Reservation } from "../../../store/slices/reservationSlice";
import { EchoSave } from "../../../store/slices/echosaveSlice";

export default function UserMyPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const [reservationData, setReservationData] = useState<{
    currentReservation: Reservation | null;
    latestEchoSave: EchoSave | null;
  }>({
    currentReservation: null,
    latestEchoSave: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const reloadUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const updatedProfile = await getUserProfile();
      console.log("📌 최신 유저 데이터:", updatedProfile);

      if (
        updatedProfile?.[0] &&
        JSON.stringify(userInfo) !== JSON.stringify(updatedProfile[0])
      ) {
        dispatch(
          setUserInfo({
            userId: updatedProfile[0].userId,
            name: updatedProfile[0].name,
            email: updatedProfile[0].email,
            phone: updatedProfile[0].phone,
            profileImageUrl: updatedProfile[0].profileImageUrl || "",
            bakeryId: null,
            addressRoad: updatedProfile[0].addressRoad || "",
            addressDetail: updatedProfile[0].addressDetail || "",
            role: "USER",
          })
        );
      } else {
        console.log("⚡ 유저 정보 변경 없음, Redux 업데이트 생략");
      }

      setReservationData({
        currentReservation: updatedProfile[0]
          .reservation[0] as unknown as Reservation | null,
        latestEchoSave: updatedProfile[0]
          .echosave as unknown as EchoSave | null,
      });
    } catch (error) {
      console.error("❌ 마이페이지 데이터 로드 실패:", error);
      setError(error as any);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, userInfo]);

  // 초기 로딩 시에만 실행되도록 수정
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    // 초기 데이터 로딩
    reloadUserProfile();

    // cleanup function
    return () => {
      setIsLoading(false);
      setError(null);
    };
  }, []); // 빈 의존성 배열로 변경

  const handleSettingsClick = useCallback(() => {
    navigate(`/user/${userInfo?.userId}/mypage/edit`);

    // 페이지 포커스 시 데이터 리로드
    const handleFocus = () => {
      reloadUserProfile();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [navigate, userInfo?.userId, reloadUserProfile]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fc973b"></div>
      </div>
    );
  }

  if (error || !userInfo) {
    return <div>Error loading user data</div>;
  }

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      console.log("로그아웃 시작");
      const response = await logout();
      dispatch(removeLocalStorage());
      console.log("로그아웃 성공:", response);
      dispatch(authLogout());
      dispatch(clearUserInfo());
      setIsLogoutModalOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert(
        error instanceof Error
          ? error.message
          : "로그아웃 중 오류가 발생했습니다."
      );
    }
  };

  return (
    <div className="min-h-screen bg-f9f9f9 pb-[60px]">
      <header className="flex justify-between items-center px-5 pb-10 pt-10">
        <h1 className="text-xl font-bold text-[#333333]">마이페이지</h1>
        <div className="flex gap-4">
          <Bell
            className="w-6 h-6 text-[#333333] cursor-pointer"
            onClick={() => navigate("/user/mypage/notifications")}
          />
          <Settings
            className="w-6 h-6 text-333333 cursor-pointer"
            onClick={handleSettingsClick}
          />
        </div>
      </header>

      <main className="px-5 flex flex-col min-h-[calc(100vh-72px)]">
        <div className="space-y-6 flex-1">
          <TicketShape
            userData={userInfo}
            params={{ userId: userInfo.userId }}
          />
          <MenuGrid />
          <StatsCards echoSave={reservationData.latestEchoSave} />
          <button
            onClick={() =>
              navigate(`/user/${userInfo.userId}/mypage/save-report`)
            }
            className="w-full text-center bg-[#F9F9F9] py-4 font-bold text-[14px] text-[#454545] shadow-md"
          >
            나의 절약 리포트 {">"}
          </button>
        </div>

        <div className="mt-auto py-6 space-y-4">
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button
              className="text-[14px] text-[#333333]"
              onClick={handleLogoutClick}
            >
              로그아웃
            </button>
            <button className="text-red-500 text-[14px]">회원탈퇴</button>
          </div>
        </div>
      </main>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
      <UserBottomNavigation />
    </div>
  );
}
