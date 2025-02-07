import { useEffect, useRef } from 'react';
import { Map, MapMarker } from "react-kakao-maps-sdk"

interface MapViewProps {
  onMarkerClick: (storeInfo: StoreInfo) => void
}

interface StoreInfo {
  id: string
  name: string
  rating: number
  distance: string
  operatingHours: string
  price: number
  originalPrice: number
  location: { lat: number; lng: number }
}

export function MapView({ onMarkerClick }: MapViewProps) {
  // 서울 시청 좌표
  const seoulCity = { lat: 37.5666805, lng: 126.9784147 }

  // 예시 카페 위치 및 정보
  const stores: StoreInfo[] = [
    {
      id: "1",
      name: "비온드론",
      rating: 4.3,
      distance: "1km",
      operatingHours: "7:00 - 7:30",
      price: 4000,
      originalPrice: 8000,
      location: { lat: 37.5656805, lng: 126.9774147 },
    },
    // Add more stores as needed
  ]

  return (
    <div className="w-full h-full">
      <Map center={seoulCity} style={{ width: "100%", height: "100%" }} level={3}>
        {stores.map((store) => (
          <MapMarker key={store.id} position={store.location} onClick={() => onMarkerClick(store)} />
        ))}
      </Map>
    </div>
  )
}

