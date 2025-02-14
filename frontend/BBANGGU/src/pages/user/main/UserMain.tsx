import { useUsermain } from "../../../hooks/user/useUsermain"
import SearchBar from "../../../components/user/usermain/SearchBar"
import Header from "../../../components/user/usermain/Header"
import BestPackages from "../../../components/user/usermain/BestPackages"
import RecommendedStores from "../../../components/user/usermain/RecommendedStores"
import ErrorBoundary from "../../../components/ErrorBoundary"
import { useNavigate } from "react-router-dom"
import { mockBakeries } from "../../../mocks/user/bakeryMockData"
import UserBottomNavigation from "../../../components/user/navigations/bottomnavigation/UserBottomNavigation"
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

export default function UserMain() {
  const {
    searchQuery,
    setSearchQuery,
    bestPackages,
    recommendedStores,
    loading,
    error,
    toggleLike,
  } = useUsermain()

  // 리덕스에서 사용자 정보 가져오기
  const userInfo = useSelector((state: RootState) => state.user.userInfo)

  const navigate = useNavigate()

  const handleStoreClick = (bakery_id: number) => {
    navigate(`/user/bakery/${bakery_id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#fc973b]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#333333] mb-4">오류가 발생했습니다</h2>
          <p className="text-[#757575]">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#fc973b] text-white rounded-md hover:bg-[#e88a2d] transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ErrorBoundary>
        <main className="px-5 pb-20">
          <section className="pt-6 pb-6 relative">
            {/* Background circle */}
            <div className="absolute right-[-30px] top-7 w-[251px] h-[251px] bg-gradient-to-b from-[#FFDFC1] to-white 0 rounded-full" />

            <div className="relative h-full flex flex-col justify-between">
              <div className="space-y-2 z-10 pb-8">
                <h1 className="text-[#fc973b] text-[22px] font-bold">
                  <span className="text-[#fc973b] text-[30px]">{userInfo?.name || '고객'}</span> 님,
                </h1>
                <p className="text-[#5a5a5a] text-[24px] font-bold">
                  빵꾸러미와 함께 환경을
                  <br />
                  지키는 하루를 시작해보세요!
                </p>
                <p className="text-[#C0C0C0] text-[16px] font-medium">
                  빵꾸와 함께
                  <br />
                  스윗한 시간 보내세요!
                </p>
              </div>
              <div className="relative z-10">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
                {/* Bread icon */}
                <div className="absolute right-[1vh] top-[-130px] z-0">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%B9%B5%EB%AA%A8%EC%96%91-DlwgBPrBVIJDKfxeSt00fJB57i08V3.png"
                    alt=""
                    className="w-[170px] h-[170px] object-contain"
                  />
                </div>
              </div>
            </div>
          </section>

          <BestPackages packages={bestPackages} bakeries={mockBakeries} onToggleLike={toggleLike} />
          <RecommendedStores stores={recommendedStores} onToggleLike={toggleLike} onStoreClick={handleStoreClick} />
        </main>
        <UserBottomNavigation />
      </ErrorBoundary>
    </div>
  )
}


