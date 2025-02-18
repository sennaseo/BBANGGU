import { useState, useEffect } from "react"
import { fetchBestFavoriteStores, searchBakery } from "../../../services/user/usermainService"
import SearchBar from "../../../components/user/usermain/SearchBar"
import Header from "../../../components/user/usermain/Header"
import BestPackages from "../../../components/user/usermain/BestPackages"
import RecommendedStores from "../../../components/user/usermain/RecommendedStores"
import ErrorBoundary from "../../../components/ErrorBoundary"
import { useNavigate } from "react-router-dom"
import UserBottomNavigation from "../../../components/user/navigations/bottomnavigation/UserBottomNavigation"
import type { BakerySearchItem } from "../../../types/bakery"
import { BakeryInfo } from "../../../store/slices/bakerySlice"
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { toggleFavoriteForUser, fetchAllBakeriesData } from "../../../services/user/usermainService"

export default function UserMain() {
  const [allBakeriesData, setAllBakeriesData] = useState<BakeryInfo[]>([])
  const [favoritebakery, setFavoritebakery] = useState<BakeryInfo[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResults] = useState<BakerySearchItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // 리덕스에서 사용자 정보 가져오기
  const userInfo = useSelector((state: RootState) => state.user.userInfo)
  const navigate = useNavigate()

  // API 데이터를 불러와서 캐시된 데이터가 있다면 재요청 없이 사용합니다.

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const allBakeryResult = await fetchAllBakeriesData()
        // const favoritebakeryResult = await fetchBestFavoriteStores()
        setAllBakeriesData(allBakeryResult.allbakery)
        // setFavoritebakery(favoritebakeryResult.favoritebakery)
        setSearchResults([])
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handleStoreClick = (bakeryId: number) => {
    navigate(`/user/bakery/${bakeryId}`)
  }

  const handleToggleFavorite = async (bakeryId: number, isLiked: boolean) => {
    try {
      await toggleFavoriteForUser(bakeryId, isLiked);
      // 좋아요 토글 시, 기존 상태의 is_liked 값을 반전하여 업데이트합니다.
      setAllBakeriesData(prevBakeries =>
        prevBakeries.map(bakery =>
          bakery && bakery.bakeryId === bakeryId
            ? { ...bakery, is_liked: !bakery.is_liked }
            : bakery
        )
      );
      setFavoritebakery(prevBakeries =>
        prevBakeries.map(bakery =>
          bakery && bakery.bakeryId === bakeryId
            ? { ...bakery, is_liked: !bakery.is_liked }
            : bakery
        )
      );
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
    }
  };

  // 검색 실행 함수: 입력받은 검색어로 API 요청 후 결과를 상태에 업데이트합니다.
  const handleSearch = async (keyword: string) => {
    try {
      const results = await searchBakery(keyword)
      setSearchResults(results)
    } catch (error) {
      console.error("검색 실패:", error)
    }
  }

  if (isLoading) {
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
                <SearchBar value={searchQuery} onChange={setSearchQuery} onSearch={handleSearch} />
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

          <BestPackages favoritebakery={favoritebakery} toggleFavoriteForUser={handleToggleFavorite} />
          <RecommendedStores allbakery={allBakeriesData} onStoreClick={handleStoreClick} toggleFavoriteForUser={handleToggleFavorite} />
        </main>
        <UserBottomNavigation />
        {searchResults.length > 0 && (
          <div className="p-4">
            <ul>
              {searchResults.map((result) => (
                <li key={result.bakeryId}>{result.name}</li>
              ))}
            </ul>
          </div>
        )}
      </ErrorBoundary>
    </div>
  )
}


