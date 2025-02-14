import { Map, MapMarker } from "react-kakao-maps-sdk"
import { useEffect, useState } from 'react';
import { MapApi } from "../../../api/user/map/MapApi";

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

interface BakeryLocation {
  bakeryId: number
  name: string
  latitude: number
  longitude: number
}

export function MapView({ onMarkerClick }: MapViewProps) {
  const [bakeries, setBakeries] = useState<BakeryLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 서울 시청 좌표 (기본 중심점)
  const seoulCity = { lat: 37.5666805, lng: 126.9784147 }

  useEffect(() => {
    // 이미지 로드 확인을 위한 로그
    console.log('마커 이미지 경로:', '/marker.png');
    
    const fetchBakeries = async () => {
      try {
        const data = await MapApi.getAllBakeries();
        console.log('받아온 베이커리 데이터:', data);
        setBakeries(data);
      } catch (error) {
        console.error('베이커리 데이터 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBakeries();
  }, []);

  const handleMarkerClick = (bakery: BakeryLocation) => {
    // API 데이터를 StoreInfo 형식으로 변환
    const storeInfo: StoreInfo = {
      id: bakery.bakeryId.toString(),
      name: bakery.name,
      rating: 0, // API에서 제공되지 않는 정보는 기본값 설정
      distance: "계산 필요", // 현재 위치 기반으로 계산 필요
      operatingHours: "정보 없음", // API에서 제공되지 않는 정보
      price: 0, // API에서 제공되지 않는 정보
      originalPrice: 0, // API에서 제공되지 않는 정보
      location: { lat: bakery.latitude, lng: bakery.longitude }
    };
    
    onMarkerClick(storeInfo);
  };

  return (
    <div className="w-full h-full z-10">
      <Map 
        center={seoulCity} 
        style={{ width: "100%", height: "100%" }} 
        level={3}
      >
        {!isLoading && bakeries.map((bakery) => (
          <MapMarker
            key={bakery.bakeryId}
            position={{ lat: bakery.latitude, lng: bakery.longitude }}
            onClick={() => handleMarkerClick(bakery)}
            image={{
              src: "/marker.png",  // 이미지 경로 확인
              size: {
                width: 40,  // 크기 조정
                height: 40
              },
              options: {
                offset: {
                  x: 20,
                  y: 20
                }
              }
            }}
          />
        ))}
      </Map>
    </div>
  )
}