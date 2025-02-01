import { useParams, Link } from "react-router-dom"
import { useBakeryDetail } from "../../hooks/useBakeryDetail"
import BakeryHeader from "../../components/user/bakerydetail/BakeryHeader"
import BakeryInfo from "../../components/user/bakerydetail/BakeryInfo"
import BakeryLocation from "../../components/user/bakerydetail/BakeryLocation"
import BakeryReviews from "../../components/user/bakerydetail/BakeryReviews"
import OrderButton from "../../components/user/bakerydetail/OrderButton"

export default function BakeryDetail() {
  const { name } = useParams<{ name: string }>()
  const { bakery, isLoading, error } = useBakeryDetail(name)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading bakery details</div>

  return (
    <div className="min-h-screen bg-white pb-20">
      <BakeryHeader />
      {bakery && (
        <div className="flex flex-col mx-auto max-w-5xl">
          <div className="h-50 w-full overflow-hidden">
            <img
              src={bakery.bannerImage || "/placeholder.svg"}
              alt={`${bakery.name} banner`}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="px-[20px]">
              <BakeryInfo bakery={bakery} />
            </div>
            <BakeryLocation location={bakery.location} />
            <div className="px-[20px]">
              <BakeryReviews reviews={bakery.reviews} />
            </div>
          </div>
        </div>
      )}
      <OrderButton />
    </div>
  )
}

