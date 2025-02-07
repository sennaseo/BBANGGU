import { useEffect, useRef } from 'react';

function KakaoMap() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadKakaoMap = async () => {
      try {
        console.log('카카오맵 로딩 시작');
        
        if (!window.kakao) {
          console.log('카카오 스크립트 로드 중...');
          const script = document.createElement('script');
          script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false`;
          
          await new Promise((resolve, reject) => {
            script.onload = () => {
              console.log('카카오 스크립트 로드 완료');
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

        console.log('카카오맵 초기화 시작');
        window.kakao.maps.load(() => {
          console.log('카카오맵 로드 콜백 실행');
          if (!mapContainer.current) {
            console.error('맵 컨테이너가 없습니다');
            return;
          }
          
          const options = {
            center: new window.kakao.maps.LatLng(37.5665, 126.9780),
            level: 3
          };
          
          try {
            const map = new window.kakao.maps.Map(mapContainer.current, options);
            console.log('지도가 생성되었습니다:', map);
          } catch (error) {
            console.error('지도 생성 중 오류:', error);
          }
        });

      } catch (error) {
        console.error('카카오맵 로드 중 오류:', error);
      }
    };

    loadKakaoMap();

    // cleanup 함수 추가
    return () => {
      if (mapContainer.current) {
        mapContainer.current.innerHTML = '';
      }
    };
  }, []);

  console.log('API KEY:', import.meta.env.VITE_KAKAO_MAP_API_KEY);

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
