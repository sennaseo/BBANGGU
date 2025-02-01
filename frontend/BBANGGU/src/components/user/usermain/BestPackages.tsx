import { HeartIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid"
import { useRef } from "react"
import DraggableScroller from "./DraggableScroller"

interface Package {
  id: number
  title: string
  store: string
  imageUrl: string
  isLiked: boolean
}

interface BestPackagesProps {
  packages: Package[]
  onToggleLike: (id: number, isLiked: boolean) => void
}

export default function BestPackages({ packages, onToggleLike }: BestPackagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

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

  return (
    <section className="mb-8 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px] font-bold text-[#333333]">BEST 빵꾸러미</h2>
        <button onClick={scroll} className="flex items-center text-[#333333] hover:text-[#fc973b] transition-colors">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
      {/* 스크롤바 */}
      <DraggableScroller ref={scrollRef} className="flex gap-4 overflow-x-scroll scrollbar-hide -mx-5 px-5">
        {packages.map((pkg) => (
          <div key={pkg.id} className="flex-none w-[130px] text-center">
            <div className="relative aspect-square mb-2">
              <img
                src={pkg.imageUrl || "/placeholder.svg"}
                alt={pkg.title}
                className="w-full h-full object-cover rounded-[12px]"
              />
              <button
                className="absolute right-2 bottom-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm
                          hover:bg-white transition-colors"
                onClick={() => onToggleLike(pkg.id, pkg.isLiked)}
              >
                {pkg.isLiked ? (
                  <HeartIconSolid className="w-5 h-5 text-[#fc973b]" />
                ) : (
                  <HeartIcon className="w-5 h-5 text-[#B4B4B4]" />
                )}
              </button>
            </div>
            <h3 className="font-medium text-[16px] text-[#454545] font-semibold mb-1 line-clamp-1">{pkg.title}</h3>
            <p className="text-[12px] text-[#B4B4B4] line-clamp-1">{pkg.store}</p>
          </div>
        ))}
      </DraggableScroller>
    </section>
  )
}

