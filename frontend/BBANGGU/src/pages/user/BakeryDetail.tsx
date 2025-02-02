import { useParams } from "react-router-dom"
import { useBakeryDetail } from "../../hooks/useBakeryDetail"
import BakeryHeader from "../../components/user/bakerydetail/BakeryHeader"
import BakeryInfo from "../../components/user/bakerydetail/BakeryInfo"
import BakeryLocation from "../../components/user/bakerydetail/BakeryLocation"
import BakeryReviews from "../../components/user/bakerydetail/BakeryReviews"
import OrderButton from "../../components/user/bakerydetail/OrderButton"

export default function BakeryDetail() {
  const { bakery_id } = useParams<{ bakery_id: string }>()
  const parsedBakeryId = bakery_id ? Number.parseInt(bakery_id, 10) : undefined
  const { bakery, isLoading, error } = useBakeryDetail(bakery_id)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading bakery details</div>
  if (!bakery) return <div>Bakery not found</div>

  return (
    <div className="min-h-screen bg-white pb-20">
      <BakeryHeader />
      <div className="flex flex-col mx-auto max-w-5xl">
        <div className="h-50 w-full overflow-hidden">
          <img
            src={bakery.photo_url || "/placeholder.svg"}
            alt={`${bakery.name} banner`}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <div className="px-[20px]">
            <BakeryInfo bakery={bakery} />
          </div>
          <BakeryLocation
            location={{
              address_road: bakery.address_road,
              address_detail: bakery.address_detail,
              latitude: bakery.latitude,
              longitude: bakery.longitude,
            }}
          />
          <div className="px-[20px]">
            <BakeryReviews bakery_id={bakery.bakery_id} reviews={bakery.reviews} />
          </div>
        </div>
      </div>
      <OrderButton />
    </div>
  )
}

