import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { Reservation } from "../../../../store/slices/reservationSlice"
import { getReservationDetail } from "../../../../services/user/mypage/reservation/reservationService"
import CancelReservationModal from "../../../../components/user/mypage/CancelReservationModal"
import { deleteReservation } from "../../../../services/user/mypage/reservation/reservationService"

export function ReservationDetail() {
  const navigate = useNavigate()
  const { userId, reservationId } = useParams<{ userId: string, reservationId: string }>()
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    async function fetchReservation() {
      try {
        const res = await getReservationDetail(Number(reservationId));
        setReservation(res);
      } catch (error) {
        console.error('예약 세부 정보 로드 실패:', error);
      }
    }
    fetchReservation();
  }, [reservationId]);

  // reviewStatus가 'completed'나 'deleted'이면 reviewdetail 페이지로 자동 이동
  useEffect(() => {
    if (reservation && reservation.reviewStatus) {
      if (reservation.reviewStatus.toLowerCase() === 'completed' || reservation.reviewStatus.toLowerCase() === 'deleted') {
        navigate(`/user/${userId}/mypage/reviews/${reservation.reservationId}`);
      }
    }
  }, [reservation, navigate]);

  if (!reservation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fc973b"></div>
      </div>
    );
  }

  // 예약 상태 한글 변환
  const statusMap = {
    pending: "주문 예약",
    canceled: "주문 취소",
    completed: "픽업 완료",
    confirmed: "픽업 예약",
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
  const pickupTime = formatDate(reservation.pickupAt);

  const handleCancelReservation = async (cancelReason: string) => {
    try {
      const result = await deleteReservation(Number(reservationId), cancelReason);
      if(result) {
        // 취소 성공 시 navigate(-1) 등으로 이동하거나 상태 업데이트
        navigate(-1);
      }
    } catch(error) {
      console.error("취소 요청 실패:", error);
    } finally {
      setShowCancelModal(false);
    }
  };
  console.log("e", reservation)
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
                {statusMap[reservation.status.toLowerCase() as keyof typeof statusMap]}
              </div>
              <div className="text-xl font-bold leading-tight">{reservation.bakeryName}</div>
              <div className="text-sm">
                {pickupTime.date} {reservation.createdAt} ~ {parseInt(pickupTime.time.split(':')[0]) + 1}:00 방문
              </div>
            </div>
          </div>

          {/* 주문 내역 섹션 */}
          <div className="bg-[#F9F9F9] p-5 rounded-xl border-t border-dashed border-gray-200 shadow-md">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <span className="font-light">{reservation.packageName}</span>
                <span className="text-gray-600">x{reservation.quantity ? reservation.quantity : 1}</span>
              </div>
              <div>
                {reservation.price.toLocaleString()}원
              </div>
            </div>

            <div className="flex justify-between font-bold mt-3 pt-3 border-t border-gray-200">
              <span>합계</span>
              <span>{reservation.price.toLocaleString()}원</span>
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
              {reservation.bakeryId} {reservation.bakeryId}
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
      { (reservation.status.toLowerCase() === "pending" || reservation.status.toLowerCase() === "confirmed") && (
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
        <CancelReservationModal 
          onClose={() => setShowCancelModal(false)}
          onSubmit={handleCancelReservation}
        />
      )}
    </div>
  )
}