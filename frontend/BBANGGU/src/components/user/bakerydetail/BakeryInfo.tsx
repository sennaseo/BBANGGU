import { Heart } from "lucide-react"
import { Link } from "react-router-dom"
import type { BakeryType } from "../../../types/bakery"
import { MapPinIcon, StarIcon } from "@heroicons/react/24/solid"

interface BakeryInfoProps {
  bakery: BakeryType
}

export default function BakeryInfo({ bakery }: BakeryInfoProps) {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-[20px] items-start">
          <img
            src={bakery.photo_url || "/placeholder.svg"}
            alt={`${bakery.name} logo`}
            className="h-[82px] w-[82px] rounded-lg object-cover"
          />
          <div>
            <h1 className="text-[20px] font-bold">{bakery.name}</h1>
            <Link
              to={`/bakery/${bakery.bakery_id}/reviews`}
              className="mt-1 flex items-center gap-2 text-[#7D7D7D] hover:text-gray-900"
            >
              <span className="text-[13px]">리뷰 보기 &gt;</span>
            </Link>
            <div className="flex gap-3 mt-1">
              <span className="flex items-center text-[12px] gap-1 text-[#757575] font-light">
                <StarIcon className="size-3.5 solid fill-[#FFB933] stroke-none" />{" "}
                {/* Rating would come from reviews */}
              </span>
              <span className="flex items-center text-[11px] gap-1 text-[#D2D2D2] font-light">
                <MapPinIcon className="size-3.5" />
                {/* Distance would need to be calculated */}
              </span>
            </div>
          </div>
        </div>
        <button className="rounded-full p-2 hover:bg-gray-100">
          <Heart className="h-5 w-5" />
        </button>
      </div>

      <div className="flex rounded-lg gap-4 items-center py-4">
        <h2 className="font-medium text-[14px] text-[#454545]">PICK UP</h2>
        <p className="text-[12px] font-light text-[#949494]">
          {/* Pickup time would need to be added to the bakery type */}
        </p>
      </div>

      <p className="text-[#747474] text-[11px]">{bakery.description}</p>
    </div>
  )
}

