import { HeartIcon as HeartOutline, ChevronRightIcon } from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid"
import { useRef, useMemo } from "react"
import DraggableScroller from "./DraggableScroller"
import type { PackageType, BakeryType } from "../../../types/bakery"
import { useNavigate } from "react-router-dom"

interface BestPackagesProps {
  packages: PackageType[]
  bakeries: BakeryType[]
  onToggleLike: (bakery_id: number) => void
}

export default function BestPackages({ packages, bakeries, onToggleLike }: BestPackagesProps) {
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

  const handlePackageClick = (bakery_id: number) => {
    navigate(`/bakery/${bakery_id}`)
  }

  // Sort packages by price (descending order) and memoize the result
  const sortedPackages = useMemo(() => [...packages].sort((a, b) => b.price - a.price), [packages])

  return (
    <section className="mb-8 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px] font-bold text-[#333333]">BEST 빵꾸러미</h2>
        <button onClick={scroll} className="flex items-center text-[#333333] hover:text-[#fc973b] transition-colors">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
      <DraggableScroller ref={scrollRef} className="flex gap-4 overflow-x-scroll scrollbar-hide -mx-5 px-5">
        {sortedPackages.map((pkg) => {
          const bakery = bakeries.find((b) => b.bakery_id === pkg.bakery_id)
          if (!bakery) return null

          return (
            <div
              key={`package-${pkg.bread_package_id}`}
              className="flex-none w-[130px] text-center cursor-pointer"
              onClick={() => handlePackageClick(pkg.bakery_id)}
            >
              <div className="relative aspect-square mb-2">
                <img
                  src={bakery.photo_url || "/placeholder.svg"}
                  alt={bakery.name}
                  className="w-full h-full object-cover rounded-[12px]"
                />
                <button
                  className="absolute right-2 bottom-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleLike(pkg.bakery_id)
                  }}
                >
                  {bakery.is_liked ? (
                    <HeartSolid className="w-5 h-5 text-[#fc973b]" />
                  ) : (
                    <HeartOutline className="w-5 h-5 text-[#B4B4B4]" />
                  )}
                </button>
              </div>
              <h3 className="font-medium text-[16px] text-[#454545] font-semibold mb-1 line-clamp-1">{pkg.name}</h3>
              <p className="text-[12px] text-[#B4B4B4] line-clamp-1">{bakery.name}</p>
            </div>
          )
        })}
      </DraggableScroller>
    </section>
  )
}

