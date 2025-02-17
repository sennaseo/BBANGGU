import { StarIcon } from "lucide-react"
import { Link } from "react-router-dom"
import type { ExtendedBakeryType } from "../../../types/bakery"
import { MapPinIcon } from "@heroicons/react/24/solid"
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid"

interface BakeryInfoProps {
  bakery: ExtendedBakeryType
  onFavoriteUpdate: (bakeryId: number, is_liked: boolean) => void
}

export default function BakeryInfo({ bakery, onFavoriteUpdate }: BakeryInfoProps) {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-[20px] items-start">
          <img
            src={bakery.bakeryImageUrl || "/placeholder.svg"}
            alt={`${bakery.name} logo`}
            className="h-[82px] w-[82px] rounded-lg object-cover"
          />
          <div>
            <h1 className="text-[20px] font-bold">{bakery.name}</h1>
            <Link
              to={`/user/bakery/${bakery.bakeryId}/reviews`}
              className="mt-1 flex items-center gap-2 text-[#7D7D7D] hover:text-gray-900"
            >
              <span className="text-[13px]">리뷰 {bakery.reviewCnt}개 &gt;</span>
            </Link>
            <div className="flex gap-3 mt-1">
              <span className="flex items-center gap-1 text-[#757575] font-regular text-[14px]">
                <StarIcon className="size-3.5 solid fill-[#FFB933] stroke-none" />{" "}
                {(bakery.star || 0).toFixed(1)}
                <span className="text-[12px] text-[#D2D2D2] font-light">({bakery.reviewCnt})</span>
              </span>
              <span className="flex items-center text-[14px] gap-0.5 text-[#D2D2D2] font-light">
                <MapPinIcon className="size-3.5" />
                {bakery.distance}km
              </span>
            </div>
          </div>
        </div>
        <button
          className="w-10 h-10 flex items-center justify-center bg-[#F9F9F9] rounded-full hover:bg-[#E1E1E1]"
          onClick={() => onFavoriteUpdate(bakery.bakeryId, bakery.is_liked)}
        >
          {bakery.is_liked ? (
            <HeartSolid className="w-6 h-6 text-[#fc973b]" />
          ) : (
            <HeartOutline className="w-6 h-6 text-[#757575]" />
          )}
        </button>
      </div>
      <div className="flex rounded-lg gap-3 items-center py-4">
        <h2 className="font-medium text-[16px] text-[#454545]">PICK UP TIME</h2>
        <p className="text-[13px] font-light text-[#949494]">TODAY {bakery.pickupTime?.startTime} - {bakery.pickupTime?.endTime}</p>
      </div>
      <p className="text-[#747474] text-[12px]">{bakery.description}</p>
    </div>
  )
}

