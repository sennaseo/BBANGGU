import { ChevronLeft, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { mockReservations } from "../../../../mocks/user/reservationMockData" 
import { useState } from "react"


export function ReservationHistory() {
  const navigate = useNavigate()
  const [isPastReservationsOpen, setIsPastReservationsOpen] = useState(true)

  // 예약 상태에 따른 분류
  const currentReservations = mockReservations.filter(
    reservation => reservation.status === 'pending'
  )
  const pastReservations = mockReservations.filter(
    reservation => reservation.status === 'cancelled' || reservation.status === 'completed'
  )

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const days = ['일', '월', '화', '수', '목', '금', '토']
    return `${date.getFullYear().toString().slice(2)}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${days[date.getDay()]}요일`
  }

  const ReservationItem = ({ reservation }: { reservation: typeof mockReservations[0] }) => {
    
    const getStatusText = (status: string) => {
      switch(status) {
        case 'pending':
          return '픽업 예약'
        case 'completed':
          return '픽업 완료'
        case 'cancelled':
          return '주문 취소'
        default:
          return '주문 예약'
      }
    }

    const getStatusColor = (status: string) => {
      switch(status) {
        case 'pending':
          return 'bg-[#FF6B00]' // 주황색
        case 'completed':
          return 'bg-gray-400'  // 회색
        case 'cancelled':
          return 'bg-red-400'   // 빨간색
        default:
          return 'bg-[#FF6B00]'
      }
    }
    
    return (
      <button 
        className="mb-3 w-full text-left"
        onClick={() => navigate(`/user/mypage/reservation/${reservation.reservationId}`)}
      >
        <div className="w-full bg-gray-50 rounded-xl p-4 relative shadow-md">
          <div className="flex flex-col gap-1 mb-1">
            <div className={`${getStatusColor(reservation.status)} text-white text-xs px-[11px] py-[4px] rounded-full w-fit`}>
              {getStatusText(reservation.status)}
            </div>
            <span className="font-bold text-[20px] text[#333333]">{reservation.bakeryId}</span>
          </div>
          <div className="text-gray-600">
            <span>
              {`${formatDate(reservation.reservedPickupTime)}, ${reservation.pickupAt} ~ ${
                new Date(new Date(reservation.reservedPickupTime).getTime() + 60 * 60 * 1000).toLocaleTimeString('ko-KR', {
                  hour: 'numeric',
                  minute: 'numeric',
                }
              )} 픽업`}
            </span>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <ChevronLeft className="w-5 h-5 rotate-180" />
          </div>
        </div>
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-white py-5">
      <div className="px-5">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6 relative">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold absolute left-1/2 -translate-x-1/2">주문</h1>
          <div className="w-6"></div> {/* 우측 여백 맞추기용 */}
        </div>
        {/* 예약 내역 섹션 */}
        <div className="mb-4 min-h-[400px]">
          <h2 className="text-lg font-bold mb-4">예약 내역</h2>
          
          {/* 현재 진행중인 예약 */}
          {currentReservations.length > 0 ? (
            currentReservations.map((reservation) => (
              <ReservationItem key={reservation.reservationId} reservation={reservation} />
            ))
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-500">
              주문한 내역이 없습니다
            </div>
          )}
        </div>
      </div>

      {/* 과거 예약 내역 섹션 */}
      {/* 과거 예약 내역 토글 버튼 */}
      <button 
        className="bg-[#F2F2F2] w-full flex items-center justify-between py-4 px-5 mb-4"
        onClick={() => setIsPastReservationsOpen(!isPastReservationsOpen)}
      >
        <span className="text-lg font-bold">과거 예약 내역</span>

        <ChevronDown className={`w-5 h-5 transition-transform ${isPastReservationsOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className="px-5">

        {/* 과거 예약 목록 */}
        {isPastReservationsOpen && (
          pastReservations.length > 0 ? (
            pastReservations.map((reservation) => (
              <ReservationItem key={reservation.reservationId} reservation={reservation} />
            ))
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-500">
              주문한 내역이 없습니다
            </div>
          )
        )}
      </div>
    </div>
  )
}