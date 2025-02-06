import { useUserMypage } from "../../../hooks/user/useUserMypage"
import { TicketShape } from "../../../components/user/mypage/TicketShape"
import { MenuGrid } from "../../../components/user/mypage/MenuGrid"
import { StatsCards } from "../../../components/user/mypage/StatsCards"
import { Bell, Settings } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import UserBottomNavigation from "../../../components/user/navigations/bottomnavigation/UserBottomNavigation"

export default function UserMyPage() {
  const { user_id } = useParams<{ user_id: string }>()
  const navigate = useNavigate()
  const { user, currentReservation, latestEchoSave, isLoading, error } = useUserMypage(user_id!)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fc973b"></div>
      </div>
    )
  }

  if (error || !user) {
    return <div>Error loading user data</div>
  }

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
            onClick={() => navigate('/user/mypage/edit')}
          />
        </div>
      </header>

      <main className="px-5 flex flex-col min-h-[calc(100vh-72px)]">
        <div className="space-y-6 flex-1">
          <TicketShape reservations={currentReservation} userData={user} />
          <MenuGrid />
          <StatsCards echoSave={latestEchoSave} />
          <button 
            onClick={() => navigate('/user/mypage/save-report')}
            className="w-full text-center bg-[#F9F9F9] py-4 font-bold text-[14px] text-[#454545] shadow-md"
          >
            나의 절약 리포트 {">"}
          </button>
        </div>

        <div className="mt-auto py-6 space-y-4">
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <button className="text-[#333333]">로그아웃</button>
            <button className="text-red-500">회원탈퇴</button>
          </div>
        </div>


      </main>
      <UserBottomNavigation />
    </div>
  )
}
