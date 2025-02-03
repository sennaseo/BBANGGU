import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { mockReservations } from "../../../mocks/user/reservationMockData"

export function ReservationHistory() {
  const navigate = useNavigate()

  const reservation = mockReservations[0] // 임시로 첫 번째 예약 데이터 사용

  return (
    <div className="p-5">
      {/* 헤더 */}
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="mr-4">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">주문</h1>
      </div>

      {/* 주문 내역 섹션 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4">주문 내역</h2>
        
        {/* 주문 예약 아이템 */}
        <button className="w-full flex items-center py-4 shadow-sm">
          <div className="w-full flex justify-center">
            <div 
            className="w-full flex bg-white rounded-xl p-4 shadow-md"
            onClick={() => navigate(`/reservation/${reservation.reservation_id}`)} >
              <div className="w-full flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-[14px]">
                    <div className="bg-[#FF6B00] text-white rounded-full px-3 py-1 text-sm inline-block mb-2">
                      주문 예약
                    </div>
                    <div className="font-semibold mb-1">피킹플레저</div>
                  </div>
                  <div className="text-gray-600">
                    25.01.14 화요일, 5:00 pm ~ 6:00 pm 픽업
                  </div>
                </div>
                <ChevronLeft className="w-5 h-5 rotate-180 mr-5" />
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* 주문 내역 아코디언 */}
      <button className="w-full flex items-center justify-between py-4 border-t">
        <span className="text-lg font-bold">주문 내역</span>
        <ChevronLeft className="w-5 h-5 rotate-90" />
      </button>
    </div>
  )
}