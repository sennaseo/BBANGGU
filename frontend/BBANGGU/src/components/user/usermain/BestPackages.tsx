import { HeartIcon as HeartOutline, ChevronRightIcon } from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid"
import { useRef } from "react"
import DraggableScroller from "./DraggableScroller"
import { useNavigate } from "react-router-dom"
import type { BakeryInfo } from "../../../store/slices/bakerySlice"

interface BestPackagesProps {
  favoritebakery: BakeryInfo[]
  toggleFavoriteForUser: (bakeryId: number, isLiked: boolean) => void
}

export default function BestPackages({ favoritebakery, toggleFavoriteForUser }: BestPackagesProps) {
  const imgBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;
  const scrollRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const scroll = () => {
    if (scrollRef.current) {
      const scrollAmount = 200
      const newScrollLeft = scrollRef.current.scrollLeft + scrollAmount
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }

  const handlePackageClick = (bakeryId: number) => {
    navigate(`/user/bakery/${bakeryId}`)
  }

  return (
    <section className="mb-8 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px] font-bold text-[#333333]">BEST 빵꾸러미</h2>
        <button onClick={scroll} className="flex items-center text-[#333333] hover:text-[#fc973b] transition-colors">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
      <DraggableScroller ref={scrollRef} className="flex gap-4 overflow-x-scroll scrollbar-hide -mx-5 px-5">
        {favoritebakery.map((item) => {
          // bakery 정보가 있을 경우에만 접근하도록 옵셔널 체이닝 사용
          return (
            <div
              key={`package-${item.bakeryId ?? 'no-id'}`}
              className="flex-none w-[130px] text-center cursor-pointer"
              onClick={() => item && handlePackageClick(item.bakeryId)}
            >
              <div className="relative aspect-square mb-2">
                <img
                  src={item.bakeryImageUrl ? `${imgBaseUrl}${item.bakeryImageUrl}` : `${imgBaseUrl}/uploads/7ac950cf-8a1e-4087-9215-9a84b67eb93e_breadjjanggu.jpg`}
                  alt={item.name || "빵집 이미지"}
                  className="w-full h-full object-cover rounded-[12px]"
                />
                <button
                  className="absolute right-2 bottom-2 p-1.5 rounded-full bg-[#F9F9F9] backdrop-blur-sm hover:bg-[#E1E1E1]"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteForUser(item.bakeryId, item.is_liked);
                  }}
                > 
                  {item.is_liked ? (
                    <HeartSolid className="w-5 h-5 text-[#fc973b]" />
                  ) : (
                    <HeartOutline className="w-5 h-5 text-[#B4B4B4]" />
                  )}
                </button>
              </div>
              <h3 className="font-medium text-[16px] text-[#454545] font-semibold mb-1 line-clamp-1">{item.packageName}</h3>
              <p className="text-[12px] text-[#B4B4B4] line-clamp-1">{item.bakeryName || "알 수 없음"}</p>
            </div>
          )
        })}
      </DraggableScroller>
    </section>
  )
}

