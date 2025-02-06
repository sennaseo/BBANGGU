import { Heart } from "lucide-react"

interface StoreInfo {
  id: string
  name: string
  rating: number
  distance: string
  operatingHours: string
  price: number
  originalPrice: number
}

interface StoreCardProps {
  isVisible: boolean
  store: StoreInfo | null
}

export function StoreCard({ isVisible, store }: StoreCardProps) {
  if (!isVisible || !store) return null

  return (
    <div className="fixed bottom-[60px] left-0 right-0 mx-auto max-w-[430px] p-4">
      <div className="flex items-center bg-white rounded-xl p-4 shadow-lg">
        <img src="/placeholder.svg" alt={store.name} className="w-20 h-20 rounded-lg object-cover" />
        <div className="flex-1 ml-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold">{store.name}</h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <span className="text-yellow-400">★</span>
                <span className="ml-1">{store.rating}</span>
                <span className="mx-2">·</span>
                <span>{store.distance}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">영업시간 {store.operatingHours}</div>
            </div>
            <button className="p-2">
              <Heart className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="flex items-baseline mt-2">
            <span className="text-lg font-bold">{store.price.toLocaleString()}원</span>
            <span className="text-sm text-gray-400 line-through ml-2">{store.originalPrice.toLocaleString()}원</span>
          </div>
        </div>
      </div>
    </div>
  )
}

