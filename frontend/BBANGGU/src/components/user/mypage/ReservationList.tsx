import { useState, useEffect, useMemo } from "react"
import type { ReservationType, ExtendedBakeryType } from "../../../types/bakery"
import { ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import dayjs from 'dayjs'
import 'dayjs/locale/ko' // 한국어 로케일 추가
interface ReservationListProps {
  reservations?: ReservationType[]
  params: {
    userId: number
  }
}

export function ReservationList({ reservations = [], params }: ReservationListProps) {
  const navigate = useNavigate()
  const [bakeryList, setBakeryList] = useState<ExtendedBakeryType[]>([])
  const [bakeryNames, setBakeryNames] = useState<Record<string, string>>({})
  const data = useMemo(() => {
    return reservations.length > 0 ? reservations : []
  }, [reservations])

  // API 기본 URL (env에 설정되어 있음)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

  // 제빵소 리스트를 백엔드 API로부터 가져옵니다.
  useEffect(() => {
    if (!params.userId || params.userId === 0) return; // userId가 유효하지 않을 경우 호출하지 않음
    async function fetchBakeryList() {
      try {
        const response = await fetch(`${API_BASE_URL}/bakery?userId=${params.userId}`)
        const result = await response.json()
        // result.data가 BakeryType[]라고 가정합니다.
        setBakeryList(result.data)
      } catch (error) {
        console.error("베이커리 리스트 로드 실패:", error)
      }
    }
    fetchBakeryList()
  }, [params.userId, API_BASE_URL])

  // 예약 데이터와 제빵소 리스트를 기반으로 예약별 제빵소 이름을 설정합니다.
  useEffect(() => {
    if (bakeryList.length === 0 || data.length === 0) return; // bakeryList가 비어있거나 예약 데이터가 없으면 실행하지 않음
    const names: Record<string, string> = {};
    for (const reservation of data) {
      const bakery = bakeryList.find(b => b.bakeryId === reservation.bakeryId);
      names[reservation.reservationId] = bakery?.name ?? "베이커리 정보 없음";
    }
    setBakeryNames(names);
  }, [data, bakeryList]); // bakeryList가 변경될 때만 실행

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
    const createdDate = dayjs(reservation.createdAt)
    return `${createdDate.format('YYYY년 M월 D일 dddd')} ${reservation.pickupAt} 픽업`
  }

  const renderReservation = (reservation: ReservationType) => (
    <div className="flex items-center bg-[#fc973b] rounded-xl justify-around shadow-md border-t border-dashed border-gray-200">
      <div 
        key={reservation.reservationId} 
        className="p-4 text-white"
        onClick={() => navigate(`/user/mypage/reservations/${reservation.reservationId}`)}
      >
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-[14px]">
            <span className="px-[10.5px] py-[3.5px] rounded-full text-[12px] bg-white font-semibold text-[#fc973b]">
              {getStatusLabel(reservation.status)}
            </span>
            <span className="text-base font-bold text-[16px]">
              {bakeryNames[reservation.reservationId] || '로딩 중...'}
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
    <div className="bg-[#fc973b] rounded-xl p-6 text-center shadow-md border-t border-dashed border-gray-200">
      <p className="text-white font-bold text-md">아직 주문 내역이 없어요.</p>
      <p className="text-white text-sm mt-1">첫 주문을 시작해보세요!</p>
    </div>
  )

  return (
    <div className="flex flex-col">
      {data.length > 0 ? (
        <>
          {/* 픽업시간이 가장 임박한 주문 표시 */}
          {renderReservation(
            data.sort((a, b) => 
              new Date(a.reservedPickupTime).getTime() - new Date(b.reservedPickupTime).getTime()
            )[0]
          )}
          {data.length > 1 && (
            <button
              onClick={() => navigate('/user/mypage/reservations')}
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

