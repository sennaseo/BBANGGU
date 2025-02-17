import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { useParams } from "react-router-dom"
import BakeryHeader from "../../../components/user/bakerydetail/BakeryHeader"
import BakeryInfo from "../../../components/user/bakerydetail/BakeryInfo"
import BakeryPackage from "../../../components/user/bakerydetail/BakeryPackage"
import BakeryLocation from "../../../components/user/bakerydetail/BakeryLocation"
import BakeryReviews from "../../../components/user/bakerydetail/BakeryReviews"
import OrderButton from "../../../components/user/bakerydetail/OrderButton"
import { fetchBakeryDetail } from "../../../services/user/detail/bakeryDetailService"
import { useState, useEffect, useCallback } from "react"
import type { ExtendedBakeryType } from "../../../types/bakery"
import { toggleFavoriteForUser } from "../../../services/user/usermainService"

export default function BakeryDetail() {
  const { bakeryId } = useParams<{ bakeryId: string }>()
  const userInfo = useSelector((state: RootState) => state.user.userInfo)
  const [bakery, setBakery] = useState<ExtendedBakeryType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [bakerydetail, likedMap] = await Promise.all([
        fetchBakeryDetail(Number(bakeryId)),
        localStorage.getItem("likedStores") ? JSON.parse(localStorage.getItem("likedStores") || "{}") : {}
      ])
      const updatedBakery = {
          ...bakerydetail,
          is_liked: likedMap[bakerydetail.bakeryId]
        }
        setBakery(updatedBakery)
      } catch (err) {
        setError("베이커리 정보를 불러오는 데 실패했습니다.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const toggleLike = async () => {
    if (!bakery) return;
    try {
      // 현재 좋아요 상태(bakery.is_liked)를 그대로 전달하여, 삭제 또는 추가 API 호출이 올바르게 이루어지도록 합니다.
      await toggleFavoriteForUser(bakery.bakeryId, bakery.is_liked);
      // API 호출 성공 후 UI에 표시할 새로운 즐겨찾기 상태는 현재 상태의 반전입니다.
      const newLikedStatus = !bakery.is_liked;
      setBakery({
        ...bakery,
        is_liked: newLikedStatus,
      });
      return newLikedStatus;
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (!bakery) return <div>Bakery not found</div>

  return (
    <div className="min-h-screen bg-white pb-20">
      <BakeryHeader />
      <div className="flex flex-col mx-auto max-w-5xl">
        <div className="h-[280px] w-full overflow-hidden">
          <img
            src={bakery.bakeryBackgroundImgUrl || "/placeholder.svg"}
            alt={`${bakery.name} banner`}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <div className="px-[20px]">
            {userInfo && <BakeryInfo bakery={bakery} onFavoriteUpdate={toggleLike} />}
          </div>
          <BakeryPackage packages={bakery.package.data} />
          <BakeryLocation location={bakery}/>
          <div className="px-[20px]">
            {userInfo && <BakeryReviews bakeryId={bakery.bakeryId} reviews={bakery.review} user={userInfo} />}
          </div>  
        </div>
      </div>
      <OrderButton bakeryId={bakery.bakeryId} />
    </div>
  )
}

