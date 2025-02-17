import { HeartIcon as HeartOutline, StarIcon } from "@heroicons/react/24/outline"
import { MapPinIcon, HeartIcon as HeartSolid } from "@heroicons/react/24/solid"
import type { BakeryType } from "../../../types/bakery"
import { useState } from "react";

interface RecommendedStoresProps {
  allbakery: BakeryType[]
  toggleFavoriteForUser: (bakeryId: number, isLiked: boolean) => void
  onStoreClick: (id: number) => void
}

export default function RecommendedStores({ allbakery, onStoreClick, toggleFavoriteForUser }: RecommendedStoresProps) {
  const [sortType, setSortType] = useState<string>("distance");
  const sortedStores = [...allbakery].sort((a, b) => {
    switch(sortType) {
      case "distance":
        return (a.distance || 0) - (b.distance || 0);
      case "price":
        return (a.price || 0) - (b.price || 0);
      case "review":
        return (b.reviewCnt || 0) - (a.reviewCnt || 0);
      case "rating":
        return (b.star || 0) - (a.star || 0);
      default:
        return 0;
    }
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px] font-bold text-[#333333]">유저 추천 상품</h2>
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="bg-white rounded-md p-1 text-[#fc973b] text-[14px] font-medium"
        >
          <option value="distance">거리순</option>
          <option value="price">낮은 가격순</option>
          <option value="review">리뷰많은순</option>
          <option value="rating">평점 높은순</option>
        </select>
      </div>
      <div className="space-y-3 -mx-5">
        {sortedStores.map((store, index) => (
          <div
            key={`store-${store.bakeryId ?? index}`}
            className="flex gap-4 p-4 bg-white rounded-[12px] border border-[#e1e1e1] mx-5 cursor-pointer"
            onClick={() => onStoreClick(store.bakeryId)}>
            <img
              src={store.bakeryImageUrl || "/placeholder.svg"}
              alt={store.name}
              className="w-[100px] h-[100px] object-cover rounded-[12px]"
            />
            <div className="flex-1">

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-[16px] text-[#333333] mb-1">{store.name}</h3>
                  <div className="flex items-center gap-1 text-[14px] text-[#757575] mb-1">
                    <span className="flex items-center gap-1">
                      <StarIcon className="size-3.5 solid fill-[#FFB933] stroke-none" />{" "}
                      {(store.star || 0).toFixed(1)}
                    </span>
                    <span className="text-[12px] text-[#E1E1E1]">({store.reviewCnt ?? 0})</span>
                    <span className="flex items-center text-[#D2D2D2] gap-0.5">
                      <MapPinIcon className="size-3.5" /> {store.distance}
                    </span>
                  </div>
                  <div className="text-[12px] text-[#BFBFBF] mb-1">픽업시간 : {(store.pickupTime?.startTime)} - {(store.pickupTime?.endTime)}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center bg-[#F9F9F9] rounded-full hover:bg-[#E1E1E1]"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("store.bakeryId", store.bakeryId);
                      toggleFavoriteForUser(store.bakeryId, store.is_liked);
                    }}>
                    {store.is_liked ? (
                      <HeartSolid className="w-6 h-6 text-[#fc973b]" />
                    ) : (
                      <HeartOutline className="w-6 h-6 text-[#757575]" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <span className="text-[18px] font-bold text-[#333333]">
                  {(store.price || 0).toLocaleString()}원
                </span>
                <span className="text-[14px] text-[#D2D2D2] line-through ml-2">
                  {((store.price || 0)*2).toLocaleString()}원
                </span>
              </div>
            </div>
          </div>

        ))}
      </div>
    </section>
  )
}

