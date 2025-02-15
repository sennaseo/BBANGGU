import { useParams } from "react-router-dom"
import BakeryHeader from "../../../components/user/bakerydetail/BakeryHeader"
import BakeryInfo from "../../../components/user/bakerydetail/BakeryInfo"
import BakeryPackage from "../../../components/user/bakerydetail/BakeryPackage"
import BakeryLocation from "../../../components/user/bakerydetail/BakeryLocation"
import BakeryReviews from "../../../components/user/bakerydetail/BakeryReviews"
import OrderButton from "../../../components/user/bakerydetail/OrderButton"
import { fetchBakeryDetail } from "../../../services/user/detail/bakeryDetailService"
import { useState, useEffect } from "react"
import type { ExtendedBakeryType, UserType } from "../../../types/bakery"
import { getUserProfile } from "../../../services/user/mypage/usermypageServices"
import { toggleFavoriteForUser } from "../../../services/user/usermainService"

export default function BakeryDetail() {
  const { bakeryId } = useParams<{ bakeryId: string }>()
  const [bakery, setBakery] = useState<ExtendedBakeryType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<UserType | null>(null)
  
  const toggleLike = async () => {
    if (!bakery) return;
    try {
      await toggleFavoriteForUser(bakery.bakeryId, bakery.is_liked);
      setBakery({
        ...bakery,
        is_liked: !bakery.is_liked
      });
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
    }
  };

  useEffect(() => {
    const loadBakeryDetail = async () => {
      try {
        const bakerydetail = await fetchBakeryDetail(Number(bakeryId))
        console.log("bakerydetail", bakerydetail);
        setBakery(bakerydetail)
        const users = await getUserProfile()
        setUser(users[0])
      } catch (err) {
        setError("베이커리 정보를 불러오는 데 실패했습니다.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadBakeryDetail()
  }, [bakeryId])



  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (!bakery) return <div>Bakery not found</div>

  return (
    <div className="min-h-screen bg-white pb-20">
      <BakeryHeader />
      <div className="flex flex-col mx-auto max-w-5xl">
        <div className="h-[280px] w-full overflow-hidden">
          <img
            src={bakery.bakeryImageUrl || "/placeholder.svg"}
            alt={`${bakery.name} banner`}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <div className="px-[20px]">
            {user && <BakeryInfo bakery={bakery} onFavoriteUpdate={toggleLike} />}
          </div>
          <BakeryPackage packages={bakery.package.data} />
          <BakeryLocation location={bakery}/>
          <div className="px-[20px]">
            {user && <BakeryReviews bakeryId={bakery.bakeryId} reviews={bakery.review} user={user} />}
          </div>  
        </div>
      </div>
      <OrderButton />
    </div>
  )
}

