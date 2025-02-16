import { TicketShape } from "../../../components/user/mypage/TicketShape"
import { MenuGrid } from "../../../components/user/mypage/MenuGrid"
import { StatsCards } from "../../../components/user/mypage/StatsCards"
import { Bell, Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import UserBottomNavigation from "../../../components/user/navigations/bottomnavigation/UserBottomNavigation"
import { getUserProfile } from "../../../services/user/mypage/usermypageServices"
import type { ReservationType, EchoSaveType } from "../../../types/bakery"
import { logout } from '../../../api/common/logout/logoutApi';
import { useDispatch, useSelector } from 'react-redux';
import { logout as authLogout } from '../../../store/slices/authSlice';
import { clearUserInfo } from '../../../store/slices/userSlice';
import { LogoutModal } from "../../../components/user/mypage/LogoutModal"
import { RootState } from '../../../store';

export default function UserMyPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  // 리덕스에서 유저 정보 가져오기
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  
  const [reservationData, setReservationData] = useState<{
    currentReservation: ReservationType | null,
    latestEchoSave: EchoSaveType | null,
  }>({
    currentReservation: null,
    latestEchoSave: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      getUserProfile()
        .then((data) => {
          setReservationData({
            currentReservation: data[0].reservation[0] || null,
            latestEchoSave: data[0].echosave[data[0].echosave.length - 1] || null,
          });
        })
        .catch(setError)
        .finally(() => setIsLoading(false));
    }
  }, [userInfo, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fc973b"></div>
      </div>
    )
  }

  if (error || !userInfo) {
    return <div>Error loading user data</div>
  }

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      console.log('로그아웃 시작');
      
      // API 호출
      const response = await logout();
      console.log('로그아웃 성공:', response);
      
      // 리덕스 상태 초기화
      dispatch(authLogout());
      dispatch(clearUserInfo());
      console.log('리덕스 상태 초기화 완료');
      
      // 모달 닫기
      setIsLogoutModalOpen(false);
      
      // 로그인 페이지로 이동
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert(error instanceof Error ? error.message : '로그아웃 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-f9f9f9 pb-[60px]">
      <header className="flex justify-between items-center px-5 pb-10 pt-10">
        <h1 className="text-xl font-bold text-[#333333]">마이페이지</h1>
        <div className="flex gap-4">
          <Bell 
            className="w-6 h-6 text-[#333333] cursor-pointer" 
            onClick={() => navigate('/user/mypage/notifications')}
          />
          <Settings 
            className="w-6 h-6 text-333333 cursor-pointer" 
            onClick={() => navigate(`/user/${userInfo.userId}/mypage/edit`)}
          />
        </div>
      </header>

      <main className="px-5 flex flex-col min-h-[calc(100vh-72px)]">
        <div className="space-y-6 flex-1">
          <TicketShape 
            reservations={reservationData.currentReservation} 
            userData={userInfo} 
            params={{ userId: userInfo.userId }} 
          />
          <MenuGrid />
          <StatsCards echoSave={reservationData.latestEchoSave} />
          <button 
            onClick={() => navigate(`/user/${userInfo.userId}/mypage/save-report`)}
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
  )
}
