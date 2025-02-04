import { useState, useEffect } from "react"
import type { ReservationType } from "../../../types/bakery"
import { ChevronRight } from "lucide-react"
import { mockReservations } from "../../../mocks/user/reservationMockData"
import { mockBakeries } from "../../../mocks/user/bakeryMockData"
import { useNavigate } from "react-router-dom"
import dayjs from 'dayjs'
import 'dayjs/locale/ko' // 한국어 로케일 추가

interface ReservationListProps {
  reservations?: ReservationType[]
}

export function ReservationList({ reservations = [] }: ReservationListProps) {
  const navigate = useNavigate()
  const [bakeryNames, setBakeryNames] = useState<Record<string, string>>({})
  const data = reservations.length > 0 ? reservations : mockReservations

  useEffect(() => {
    // mock 데이터에서 베이커리 정보를 가져오는 함수
    const fetchBakeryNames = () => {
      try {
        const names: Record<string, string> = {}
        for (const reservation of data) {
          const bakery = mockBakeries.find(b => b.bakery_id === reservation.bakery_id)
          names[reservation.reservation_id] = bakery?.name || '베이커리 정보 없음'
        }
        setBakeryNames(names)
      } catch (error) {
        console.error('베이커리 정보를 불러오는데 실패했습니다:', error)
      }
    }

    fetchBakeryNames()
  }, [data])

  const getStatusLabel = (status: ReservationType["status"]) => {
    switch (status) {
      case "cancelled":
        return "고객 취소"
      case "completed":
        return "픽업 완료"
      default:
        return "주문 완료"
    }
  }

  const formatPickupDateTime = (reservation: ReservationType) => {
    dayjs.locale('ko')
    const createdDate = dayjs(reservation.created_at)
    return `${createdDate.format('YYYY년 M월 D일 dddd')} ${reservation.pickup_at} 픽업`
  }

  const renderReservation = (reservation: ReservationType) => (
    <div className="flex items-center bg-[#fc973b] rounded-xl justify-around shadow-md border-t border-dashed border-gray-200">
      <div 
        key={reservation.reservation_id} 
        className="p-4 text-white"
        onClick={() => navigate(`/reservations/${reservation.reservation_id}`)}
      >
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-[14px]">
            <span className="px-[10.5px] py-[3.5px] rounded-full text-[12px] bg-white font-semibold text-[#fc973b]">
              {getStatusLabel(reservation.status)}
            </span>
            <span className="text-base font-bold text-[16px]">
              {bakeryNames[reservation.reservation_id] || '로딩 중...'}
            </span>
          </div>
        </div>
        <div className="text-base font-light">
          {formatPickupDateTime(reservation)}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-white mx-2" />
    </div>
  )

  const renderEmptyState = () => (
    <div className="bg-white rounded-xl p-6 text-center">
      <p className="text-333333 text-sm">아직 주문 내역이 없어요.</p>
      <p className="text-333333 text-sm mt-1">첫 주문을 시작해보세요!</p>
    </div>
  )

  return (
    <div className="flex flex-col">
      {data.length > 0 ? (
        <>
          {/* 픽업시간이 가장 임박한 주문 표시 */}
          {renderReservation(
            data.sort((a, b) => 
              new Date(a.reserved_pickup_time).getTime() - new Date(b.reserved_pickup_time).getTime()
            )[0]
          )}
          {data.length > 1 && (
            <button
              onClick={() => navigate('/reservations')}
              className="w-full text-[#B4B4B4] font-regular text-sm bg-white rounded-xl shadow-md py-[8px] border-t border-dashed border-gray-200"
            >
              진행중인 주문 내역 보기
              
            </button>

          )}
        </>
      ) : (
        renderEmptyState()
      )}
    </div>
  )
}

