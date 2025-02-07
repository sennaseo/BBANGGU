"use client"

import { useState } from "react"
import { Bell, User } from "lucide-react"
import { MapView } from "../../../components/user/map/MapView"
import { StoreCard } from "../../../components/user/map/StoreCard"
import UserBottomNavigation from "../../../components/user/navigations/bottomnavigation/UserBottomNavigation"

interface StoreInfo {
  id: string
  name: string
  rating: number
  distance: string
  operatingHours: string
  price: number
  originalPrice: number
}

export function MapPage() {
  const [selectedStore, setSelectedStore] = useState<StoreInfo | null>(null)

  const handleMarkerClick = (storeInfo: StoreInfo) => {
    setSelectedStore(storeInfo)
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white">
        <div className="max-w-[430px] mx-auto flex items-center justify-between p-4">
          <div className="flex items-center text-[#FF9F43]">
            <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span>위치를 설정해주세요</span>
          </div>
          <div className="flex items-center gap-4">
            <button>
              <Bell className="w-6 h-6" />
            </button>
            <button>
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="max-w-[430px] mx-auto px-4 pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="가게 이름을 입력해주세요"
              className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-200"
            />
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
        </div>
      </header>

      {/* Map Container */}
      <main className="flex-1 mt-[116px] relative w-full h-full">
        <div className="absolute inset-0">
          <MapView onMarkerClick={handleMarkerClick} />
        </div>
      </main>

      {/* Store Card */}
      <StoreCard isVisible={!!selectedStore} store={selectedStore} />
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <div className="max-w-[430px] mx-auto">
          <UserBottomNavigation/>
        </div>
      </div>
    </div>
  )
}

