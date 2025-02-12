import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import { mockReservations } from "../../../../mocks/user/reservationMockData"
import { mockBakeries } from "../../../../mocks/user/bakeryMockData"
// import { Map } from "./Map" // 지도 컴포넌트는 별도로 구현 필요

export function ReservationDetail() {
  const navigate = useNavigate()
  const { reservation_id } = useParams<{ reservation_id: string }>()
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // URL 파라미터로 전달된 reservation_id로 예약 찾기
  const reservation = mockReservations.find(
    r => r.reservation_id === Number(reservation_id)
  );
  const bakery = mockBakeries.find(b => b.bakeryId === reservation?.bakeryId);

  if (!reservation || !bakery) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fc973b"></div>
      </div>
    );
  }

  // 예약 상태 한글 변환
  const statusMap = {
    pending: "주문 예약",
    cancelled: "취소됨",
    completed: "완료",
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    // UTC 시간을 한국 시간으로 변환
    const date = new Date(dateString);
    date.setHours(date.getHours() + 9); // UTC+9 (한국 시간)

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return {
      date: `${year}년 ${month}월 ${day}일`,
      time: `${hours}:${minutes}`
    };
  };

  const pickupTime = formatDate(reservation.reserved_pickup_time);

  return (
    <div className="flex flex-col min-h-screen bg-[#F9F9F9] pb-[80px] relative max-w-[480px] mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-5 relative">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold absolute left-1/2 -translate-x-1/2">주문 상세</h1>
        <div className="w-6"></div> {/* 우측 여백 맞추기용 */}
      </div>

      {/* 티켓 모양 카드 */}
      <div className="mx-5">
        <div>
          {/* 상단 주황색 섹션 */}
          <div className="bg-[#fc973b] text-white rounded-xl shadow-md">
            <div className="flex flex-col gap-2 p-5">
              <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm w-fit">
                {statusMap[reservation.status]}
              </div>
              <div className="text-xl font-bold leading-tight">{bakery.name}</div>
              <div className="text-sm">
                {pickupTime.date} {pickupTime.time} ~ {parseInt(pickupTime.time.split(':')[0]) + 1}:00 방문
              </div>
            </div>
          </div>

          {/* 주문 내역 섹션 */}
          <div className="bg-[#F9F9F9] p-5 rounded-xl border-t border-dashed border-gray-200 shadow-md">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <span className="text-gray-600">{reservation.quantity}x</span>
                <span className="font-medium">{bakery.bread_package[0].name}</span>
              </div>
              <div>
                {reservation.total_price.toLocaleString()}원
              </div>
            </div>

            <div className="flex justify-between font-bold mt-3 pt-3 border-t border-gray-200">
              <span>합계</span>
              <span>{reservation.total_price.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </div>

      {/* 위치 정보 섹션 */}
      <div className="mx-5 mt-4 bg-white rounded-xl p-5 shadow-md">
        <button 
          className="w-full flex items-center justify-between"
          onClick={() => setIsLocationExpanded(!isLocationExpanded)}
        >
          <div className="flex gap-4 items-center">
            <div className="text-[#333333] text-[16px]">위치안내</div>
            <div className="text-[11px] text-left text-[#BDBDBD]">
              {bakery.address_road} {bakery.address_detail}
            </div>
          </div>

          {isLocationExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {isLocationExpanded && (
          <div className="relative h-[200px] rounded-lg mt-3 overflow-hidden bg-[#F8F9FA]">
            <img
              src="/src/assets/지도.png"
              alt="매장 위치"
              className="w-full h-full object-cover"
            />

            {/* 위치 마커 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
              <div className="relative">
                {/* 마커 핀 */}
                <div className="w-5 h-5 bg-[#FF8947] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"/>
                </div>
                {/* 마커 그림자 */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-black/20 rounded-full blur-[1px]"/>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      {reservation.status === "pending" && (
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-[#F9F9F9] max-w-[440px] mx-auto">
          <button 
            className="w-full bg-[#fc973b] text-white py-4 rounded-xl font-medium"
            onClick={() => setShowCancelModal(true)}
          >
            취소하기
          </button>
        </div>
      )}

      {/* 취소 확인 모달 */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl mx-5 w-full max-w-[320px] px-4 py-4">
            <div className="px-5 pt-3 pb-5 text-center">
              <h3 className="text-lg font-bold text-[#333333] mb-2">주문을 취소하시겠습니까?</h3>
              <p className="text-sm text-[#666666]">취소된 주문은 되돌릴 수 없습니다.</p>
            </div>
            <div className="flex">
              <button
                className="flex-1 p-3 font-medium bg-[#fc973b] text-white rounded-full"
                onClick={() => setShowCancelModal(false)}
              >
                돌아가기
              </button>
              <button
                className="flex-1 p-3 text-[#666666] font-medium"
                onClick={() => {
                  // TODO: 취소 로직 구현
                  setShowCancelModal(false);
                  navigate(-1);
                }}
              >
                취소하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}