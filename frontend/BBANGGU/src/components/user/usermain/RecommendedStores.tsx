import { useState } from "react"
import { HeartIcon as HeartOutline, StarIcon } from "@heroicons/react/24/outline"
import { MapPinIcon, ChevronDownIcon, HeartIcon as HeartSolid } from "@heroicons/react/24/solid"

interface Store {
  id: string
  name: string
  rating: number
  reviewCount: number
  distance: string
  hours: string
  price: number
  originalPrice: number
  imageUrl: string
  isLiked: boolean
}

interface RecommendedStoresProps {
  stores: Store[]
  onToggleLike: (id: string, isLiked: boolean) => void
  onStoreClick: (id: string) => void
}

export default function RecommendedStores({ stores, onToggleLike, onStoreClick }: RecommendedStoresProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px] font-bold text-[#333333]">유저 추천 상품</h2>
        <button className="flex items-center gap-2 text-[#fc973b] text-[14px] font-light">
          새로 생긴 가게 순 <ChevronDownIcon className="size-3" />
        </button>
      </div>
      <div className="space-y-3 -mx-5">
        {stores.map((store) => (
          <div
            key={store.id}
            className="flex gap-4 p-4 bg-white rounded-[12px] border border-[#e1e1e1] mx-5 cursor-pointer"
            onClick={() => onStoreClick(store.id)}
          >
            <img
              src={store.imageUrl || "/placeholder.svg"}
              alt={store.name}
              className="w-[100px] h-[100px] object-cover rounded-[12px]"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-[16px] text-[#333333] mb-1">{store.name}</h3>
                  <div className="flex items-center gap-1 text-[14px] text-[#757575] mb-1">
                    <span className="flex items-center gap-1">
                      <StarIcon className="size-3.5 solid fill-[#FFB933] stroke-none" /> {store.rating}
                    </span>
                    <span className="text-[12px] text-[#E1E1E1]">({store.reviewCount})</span>
                    <span className="flex items-center text-[#D2D2D2] gap-0.5">
                      <MapPinIcon className="size-3.5" /> {store.distance}
                    </span>
                  </div>
                  <div className="text-[12px] text-[#BFBFBF] mb-1">{store.hours}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleLike(store.id, store.isLiked)
                    }}
                  >
                    {store.isLiked ? (
                      <HeartSolid className="w-6 h-6 text-[#fc973b]" />
                    ) : (
                      <HeartOutline className="w-6 h-6 text-[#757575]" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <span className="text-[18px] font-bold text-[#333333]">{store.price.toLocaleString()}원</span>
                <span className="text-[14px] text-[#D2D2D2] line-through ml-2">
                  {store.originalPrice.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

