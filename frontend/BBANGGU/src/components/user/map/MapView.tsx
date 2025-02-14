import { Map, MapMarker } from "react-kakao-maps-sdk"
import { BakeryInfo } from "../../../store/slices/bakerySlice";
import { useEffect, useState } from "react";

interface MapViewProps {
  bakeries: BakeryInfo[];
  onMarkerClick: (storeInfo: BakeryInfo) => void;
  userAddress?: string | null;  // 사용자 주소 prop 추가
}

interface Coordinates {
  lat: number;
  lng: number;
}

export function MapView({ bakeries = [], onMarkerClick, userAddress }: MapViewProps) {
  const gumiCity: Coordinates = { lat: 36.1193778, lng: 128.3445913 };
  const [center, setCenter] = useState<Coordinates>(gumiCity);

  useEffect(() => {
    if (userAddress) {
      const geocoder = new kakao.maps.services.Geocoder();
      
      geocoder.addressSearch(userAddress, (result: any[], status: string) => {
        if (status === kakao.maps.services.Status.OK && result[0]) {
          const lat = Number(result[0].y);
          const lng = Number(result[0].x);
          
          setCenter({
            lat: lat || gumiCity.lat,
            lng: lng || gumiCity.lng
          });
        }
      });
    }
  }, [userAddress]);

  console.log('MapView에 전달된 bakeries:', bakeries);

  return (
    <div className="w-full h-full z-10">
      <Map 
        center={center}
        style={{ width: "100%", height: "100%" }} 
        level={3}
      >
        {bakeries && bakeries.length > 0 && bakeries.map((bakery) => {
          console.log('마커 생성:', bakery);
          return (
            <MapMarker
              key={bakery.bakeryId}
              position={{ 
                lat: bakery.latitude || 0, 
                lng: bakery.longitude || 0 
              }}
              onClick={() => onMarkerClick(bakery)}
              image={{
                src: "/marker.png",
                size: {
                  width: 40,
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
          );
        })}
      </Map>
    </div>
  )
}