import { Heart } from "lucide-react"

interface PickupTime {
  startTime: string;
  endTime: string;
}

interface BakeryInfo {
  bakeryId: number;
  name: string;
  description: string;
  star: number;
  distance: number;
  pickupTime: PickupTime | null;
  price: number;
  bakeryImageUrl: string | null;
  is_liked: boolean;
}

interface StoreCardProps {
  isVisible: boolean;
  store: BakeryInfo | null;
}

export function StoreCard({ isVisible, store }: StoreCardProps) {
  if (!isVisible || !store) return null;

  const operatingHours = store.pickupTime 
    ? `${store.pickupTime.startTime} - ${store.pickupTime.endTime}`
    : "영업시간 정보 없음";

  return (
    <div className="fixed bottom-[60px] left-0 right-0 mx-auto max-w-[430px] p-4 z-20">
      <div className="flex items-center bg-white rounded-xl p-4 shadow-lg">
        <img 
          src={store.bakeryImageUrl || "/placeholder.svg"} 
          alt={store.name} 
          className="w-20 h-20 rounded-lg object-cover" 
        />
        <div className="flex-1 ml-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold">{store.name}</h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <span className="text-yellow-400">★</span>
                <span className="ml-1">{store.star.toFixed(1)}</span>
                <span className="mx-2">·</span>
                <span>{store.distance}km</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{operatingHours}</div>
            </div>
            <button className="p-2">
              <Heart 
                className={`w-5 h-5 ${store.is_liked ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
              />
            </button>
          </div>
          <div className="flex items-baseline mt-2">
            <span className="text-lg font-bold">{store.price.toLocaleString()}원</span>
          </div>
        </div>
      </div>
    </div>
  )
}

