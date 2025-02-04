import { ChevronLeft, MapPin } from "lucide-react"
import { useNavigate } from "react-router-dom"
// import { Map } from "./Map" // 지도 컴포넌트는 별도로 구현 필요

export function ReservationDetail() {
  const navigate = useNavigate()

  const handleMapClick = () => {
    // 카카오맵 URL로 이동 (예시 좌표)
    window.open('https://map.kakao.com/link/map/피킹플레저,35.153445,129.059647', '_blank')
  }

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <div className="flex items-center p-4">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">주문 상세</h1>
      </div>

      {/* 주문 정보 카드 */}
      <div className="bg-[#fc973b] p-4 text-white">
        <div className="inline-block bg-white text-[#fc973b] rounded-full px-3 py-1 text-sm mb-2">
          주문 예약
        </div>
        <h2 className="text-lg font-bold mb-1">피킹플레저</h2>
        <p className="text-sm">25.01.14 화요일, 5:00 pm ~ 6:00 pm 픽업</p>
      </div>

      {/* 주문 상품 목록 */}
      <div className="bg-white p-4">
        <div className="flex justify-between items-center py-4 border-b">
          <div>
            <p className="text-gray-600 mb-1">lucky bag</p>
            <p>1x 한식 도시락</p>
          </div>
          <p className="font-medium">4,400원</p>
        </div>
      </div>

      {/* 위치 정보 */}
      <div className="flex-1 bg-gray-100 p-4">
        <h3 className="font-bold mb-2">위치안내</h3>
        <p className="text-sm text-gray-600 mb-4">
          경상북도 진해동 453 (현 마트로부터 약 256m, 도보3분)
        </p>
        {/* 지도 대신 카카오맵 링크 버튼 */}
        <button 
          onClick={handleMapClick}
          className="w-full h-[200px] bg-gray-200 rounded-lg flex flex-col items-center justify-center gap-2"
        >
          <MapPin className="w-8 h-8 text-gray-500" />
          <p className="text-gray-600">카카오맵에서 보기</p>
        </button>
      </div>

      {/* 하단 버튼 */}
      <div className="p-4">
        <button className="w-full bg-[#fc973b] text-white py-4 rounded-lg font-bold">
          취소하기
        </button>
      </div>
    </div>
  )
}