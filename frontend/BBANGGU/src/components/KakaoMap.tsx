import { useEffect, useRef } from 'react';

function KakaoMap() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadKakaoMap = async () => {
      try {
        if (!window.kakao) {
          const script = document.createElement('script');
          script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false`;

          await new Promise((resolve, reject) => {
            script.onload = () => {
              resolve(null);
            };
            script.onerror = (error) => {
              console.error('카카오 스크립트 로드 실패:', error);
              reject(error);
            };
            document.head.appendChild(script);
          });
        }

        if (!window.kakao?.maps) {
          console.error('카카오 맵 객체가 없습니다');
          return;
        }

        window.kakao.maps.load(() => {
          if (!mapContainer.current) {
            console.error('맵 컨테이너가 없습니다');
            return;
          }
          
          const options = {
            center: new window.kakao.maps.LatLng(37.5665, 126.9780),
            level: 3
          };
          
          try {
            new window.kakao.maps.Map(mapContainer.current, options);
          } catch (error) {
            console.error('지도 생성 중 오류:', error);
          }
        });

      } catch (error) {
        console.error('카카오맵 로드 중 오류:', error);
      }
    };

    loadKakaoMap();

    // cleanup 함수에서 mapContainer.current를 안전하게 사용하기 위해 변수에 복사
    const currentMapContainer = mapContainer.current;

    return () => {
      if (currentMapContainer) {
        currentMapContainer.innerHTML = '';
      }
    };
  }, []);

  return (
    <div 
      ref={mapContainer} 
      style={{ 
        width: '100%', 
        height: '500px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ddd'
      }} 
    />
  );
}

export default KakaoMap;
