import { ChevronDown } from "lucide-react"
import type { BakeryType } from "../../../types/bakery"

interface BakeryLocationProps {
  location: BakeryType
}

export default function BakeryLocation({ location }: BakeryLocationProps) {
  return (
    <div className="py-[20px] flex bg-[#F2F2F2]">
      <button className="flex w-full justify-between items-center px-[20px] gap-3">
        <div className="flex gap-3 items-center">
          <h2 className="whitespace-nowrap text-[14px] font-medium text-[#333333]">위치안내</h2>
          <p className="text-[12px] font-light text-[#BDBDBD]">{location.addressRoad}</p>
          <p className="text-[12px] font-light text-[#BDBDBD]">({location.addressDetail})</p>
        </div>
        <ChevronDown className="h-6 w-6 text-[#A2A2A2]" />
      </button>
    </div>
  )
}


