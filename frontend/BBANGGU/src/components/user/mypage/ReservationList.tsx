import { useState, useEffect, useMemo } from "react"
import type { Reservation } from "../../../store/slices/reservationSlice"
import { ChevronRight } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import dayjs from 'dayjs'
import 'dayjs/locale/ko' // 한국어 로케일 추가
import type { BakeryInfo } from "../../../store/slices/bakerySlice"
interface ReservationListProps {
  reservations?: Reservation[]
  params: {
    userId: number
  }
}

export function ReservationList({ reservations = [] }: ReservationListProps) {
  const navigate = useNavigate()
  const [bakeryList] = useState<BakeryInfo[]>([])
  const data = useMemo(() => {
    return reservations.length > 0 ? reservations : []
  }, [reservations])
  const { userId } = useParams<{ userId: string }>()

  useEffect(() => {
    if (
      bakeryList.length === 0 ||
      data.length === 0 ||
      data.every(
        (reservation) =>
          reservation.status.toLowerCase() === "completed" || reservation.status.toLowerCase() === "canceled"
      )
    ) {
      console.log("reservation", data)
      return; // bakeryList가 비어있거나 예약 데이터가 없거나 모든 예약이 완료/취소 상태이면 실행하지 않음
    }
  }, [data, bakeryList]); // bakeryList가 변경될 때만 실행

  const getStatusLabel = (status: Reservation["status"]) => {
    switch (status.toLowerCase()) {
      case "canceled":
        return "주문 취소"
      case "completed":
        return "픽업 완료"
      case "confirmed":
        return "픽업 예약"
      case "pending":
        return "주문 예약"
    }
  }

  const formatPickupDateTime = (reservation: Reservation) => {
    dayjs.locale('ko')
    const createdDate = dayjs(reservation.createdAt)
    const pickupTime = dayjs(reservation.createdAt).add(1, 'hour').format('HH:mm');
    return `${createdDate.format('YYYY년 M월 D일 dddd')} ${pickupTime} 픽업 예약`
  }

  const renderReservation = (reservation: Reservation) => (
    <button 
      className="flex items-center bg-[#fc973b] rounded-xl justify-between shadow-md border-t border-dashed border-gray-200 pl-[20px] pr-[10px]"
      onClick={() => navigate(`/user/${userId}/mypage/reservation/${reservation.reservationId}`)}
    >
      <div 
        key={reservation.reservationId} 
        className="p-4 text-white"
      >
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-[14px]">
            <span className="px-[10.5px] py-[3.5px] rounded-full text-[12px] bg-white font-semibold text-[#fc973b]">
              {getStatusLabel(reservation.status)}
            </span>
            <span className="text-base font-bold text-[16px]">
              {bakeryList.find(b => b.bakeryId === reservation.bakeryId)?.name || '로딩 중...'}
            </span>
          </div>
        </div>
        <div className="text-base font-light">
          {formatPickupDateTime(reservation)}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-white mx-2" />
    </button>
  )

  const renderEmptyState = () => (
    <div className="bg-[#fc973b] rounded-xl p-6 text-center shadow-md border-t border-dashed border-gray-200">
      <p className="text-white font-bold text-md">아직 주문 내역이 없어요.</p>
      <p className="text-white text-sm mt-1">첫 주문을 시작해보세요!</p>
    </div>
  )
  console.log("data", data)

  const currentReservations = data.filter(
    reservation =>
      reservation.status.toLowerCase() !== "completed" &&
      reservation.status.toLowerCase() !== "canceled"
  );
  console.log("currentReservations", currentReservations)
  return (
    <div className="flex flex-col">
      {currentReservations.length > 0 ? (
        <>
          {/* 픽업시간이 가장 임박한 주문 표시 */}
          {renderReservation(
            currentReservations
              .sort((a, b) =>
                new Date(a.pickupAt).getTime() - new Date(b.pickupAt).getTime()
              )[0]
          )}
          {currentReservations.length > 0 && (
            <button
              onClick={() => navigate(`/user/${userId}/mypage/reservations`)}
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

