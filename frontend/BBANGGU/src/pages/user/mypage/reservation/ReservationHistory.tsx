import { ChevronLeft, ChevronDown } from "lucide-react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { getReservations } from "../../../../services/user/mypage/reservation/reservationService"
import dayjs from "dayjs"
import { Reservation } from "../../../../store/slices/reservationSlice"


export function ReservationHistory() {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>();
  const [currentReservations, setCurrentReservations] = useState<Reservation[]>([]);
  const [pastReservations, setPastReservations] = useState<Reservation[]>([]);
  const [isPastReservationsOpen, setIsPastReservationsOpen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const location = useLocation();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const startDate = dayjs().subtract(7, "day").format("YYYY-MM-DD");
      const endDate = dayjs().format("YYYY-MM-DD");
      const reservations = await getReservations(startDate, endDate);
      console.log("reservations", reservations)
      const reservationsArray = Array.isArray(reservations) ? reservations : [reservations];
      setCurrentReservations(
        reservationsArray.filter((reservation) => 
          reservation.status.toLowerCase() === 'pending' || reservation.status.toLowerCase() === 'confirmed'
        )
      );
      setPastReservations(
        reservationsArray.filter((reservation) => {
          const status = reservation.status.toLowerCase();
          return status === 'canceled' || status === 'completed';
        })
      );
    } catch (error) {
      console.error('예약 내역 로드 실패:', error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadData();
  }, []);

  // 리뷰 작성 후 새로고침
  useEffect(() => {
    if (location.state?.reviewSubmitted) {
      loadData();
      // state 초기화
      navigate('.', { replace: true });
    }
  }, [location.state, navigate]);

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const days = ['일', '월', '화', '수', '목', '금', '토']
    return `${date.getFullYear().toString().slice(2)}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${days[date.getDay()]}요일`
  }

  const ReservationItem = ({ reservation }: { reservation: Reservation }) => {
    const getStatusText = (status: string) => {
      switch(status.toLowerCase()) {
        case 'pending':
          return '주문 예약';
        case 'completed':
          return '픽업 완료';
        case 'canceled':
          return '주문 취소';
        case 'confirmed':
          return '주문 확정';
      }
    }

    const getStatusColor = (status: string) => {
      switch(status.toLowerCase()) {
        case 'pending':
          return 'bg-[#FF6B00]'; // 주황색
        case 'completed':
          return 'bg-gray-400';  // 회색
        case 'canceled':
          return 'bg-red-400';   // 빨간색
        default:
          return 'bg-[#FF6B00]';
      }
    }
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#fc973b]"></div>
        </div>
      )
    }
  
    if (error) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#333333] mb-4">오류가 발생했습니다</h2>
            <p className="text-[#757575]">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#fc973b] text-white rounded-md hover:bg-[#e88a2d] transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      )
    }
    return (
      <>
        <div 
          className="mb-3 w-full text-left cursor-pointer"
          onClick={() => navigate(`/user/${userId}/mypage/reservation/${reservation.reservationId}`)}
        >
          <div className="w-full bg-white rounded-xl p-4 relative border border-gray-200 hover:border-[#fc973b]">
            <div className={`${getStatusColor(reservation.status)} text-white text-xs px-[11px] py-[4px] rounded-full w-fit`}>
              {getStatusText(reservation.status)}
            </div>
            <div className="flex flex-col mt-2 ml-1">
              <span className="font-bold text-[18px] text-[#333333]">{reservation.bakeryName}</span>
              <div className="text-gray-600 text-[14px] font-light">
                <span>
                  {`${formatDate(reservation.createdAt)}, ${
                    reservation.pickupAt 
                    ? `${dayjs(reservation.pickupAt).format('HH:mm')} ~ ${dayjs(reservation.pickupAt).add(1, 'hour').format('HH:mm')} 픽업`
                    : '픽업 시간 미정'
                  }`}
                </span>
              </div>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <ChevronLeft className="w-5 h-5 rotate-180" />
            </div>
            {reservation.status.toLowerCase() === 'completed' && (
              <>
                {reservation.reviewStatus.toLowerCase() === 'deleted' ? (
                  <div className="mt-3 w-full text-center p-2 rounded-xl font-semibold bg-gray-200 text-gray-500">
                    리뷰가 삭제되었습니다
                  </div>
                ) : (
                  <button 
                    className={`mt-3 w-full text-white py-2 rounded-xl font-semibold ${reservation.reviewStatus.toLowerCase() === 'completed' ? 'bg-gray-400 hover:bg-gray-500' : 'bg-[#fc973b] hover:bg-[#e88a2d]'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (reservation.reviewStatus.toLowerCase() === 'completed') {
                        navigate(`/user/${userId}/mypage/reviews/${reservation.reservationId}`, { state: { bakeryName: reservation.bakeryName } });
                      } else {
                        navigate(`/user/${userId}/mypage/reservation/${reservation.reservationId}/write-review`);
                      }
                    }}
                  >
                    {reservation.reviewStatus.toLowerCase() === 'completed' ? '리뷰 보기' : '리뷰 쓰기'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </>
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