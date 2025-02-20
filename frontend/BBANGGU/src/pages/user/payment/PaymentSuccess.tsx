import { useNavigate, useSearchParams } from "react-router-dom"
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import PaymentButton from "../../../components/user/payment/common/PaymentButton"
import { ReservationApi } from '../../../api/user/reservation/PaymentApi'
import { useState } from "react"

export function PaymentSuccess() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const userInfo = useSelector((state: RootState) => state.user.userInfo)
  const [error, setError] = useState<string | null>(null)
  
  // localStorage에서 userInfo 가져오기
  const localStorageUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  
  // userInfo 상태 확인을 위한 로그
  console.log('===== 현재 userInfo 상태 =====', userInfo);
  console.log('===== localStorage의 userInfo =====', localStorageUserInfo);
  
  // sessionStorage에서 reservationId 가져오기
  const storedReservationId = sessionStorage.getItem('currentReservationId');
  console.log('===== sessionStorage에서 가져온 reservationId =====', storedReservationId);
  
  const paymentKey = searchParams.get('paymentKey')
  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')

  console.log('===== 결제 완료 페이지 데이터 =====', {
    storedReservationId,
    paymentKey,
    orderId,
    amount
  });

  const handleHomeClick = async () => {
    try {
      if (!storedReservationId || !paymentKey || !orderId || !amount) {
        console.error('필수 파라미터 누락:', { 
          storedReservationId, 
          paymentKey, 
          orderId, 
          amount 
        })
        throw new Error('필수 결제 정보가 누락되었습니다.')
      }

      const parsedReservationId = parseInt(storedReservationId)
      
      console.log('===== 예약 생성 요청 데이터 =====', {
        reservationId: parsedReservationId,
        paymentKey,
        orderId,
        amount: Number(amount)
      });

      const response = await ReservationApi.createReservation({
        reservationId: parsedReservationId,
        paymentKey,
        orderId,
        amount: Number(amount)
      })

      console.log('===== 예약 생성 응답 =====', response.data);

      if (response.data.status === 'CONFIRMED') {
        console.log('예약 생성 성공!');
        // 성공 후 sessionStorage 클리어
        sessionStorage.removeItem('currentReservationId');
        console.log('===== sessionStorage에서 reservationId 제거 =====');
        navigate('/user')
      }
    } catch (error: any) {
      console.error('예약 생성 실패:', error)
      setError(error.response?.data?.message || '예약 생성에 실패했습니다.')
    }
  }

  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center p-5">
        <p className="text-red-500 mb-4">{error}</p>
        <PaymentButton 
          onClick={() => navigate(-1)}
          text="다시 시도하기"
        />
      </div>
    )
  }

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-white pb-20">
      <div className="flex-1 px-5 flex flex-col items-center justify-center" style={{ minHeight: "calc(100vh - 80px)" }}>
        <div className="flex flex-col items-center space-y-6 mb-10">
          <div className="w-[120px] h-[120px] bg-[#FFF5E9] rounded-full flex items-center justify-center mb-4">
            <img 
              src="/bakery/빵꾸러미.png" 
              alt="빵꾸러미" 
              className="h-[80px]"
            />
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">예약이 완료되었어요!</h2>
            <p className="text-gray-600 mb-1">
              {localStorageUserInfo.name ? `${localStorageUserInfo.name}님 덕분에` : '고객님 덕분에'}
            </p>
            <p className="text-gray-600">이 음식은 더 이상 버리지 않게 되었어요!</p>
          </div>

          <div className="w-full max-w-sm bg-gray-50 rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">주문번호</span>
                <span className="font-medium">#{orderId?.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">결제금액</span>
                <span className="font-medium">{Number(amount).toLocaleString()}원</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentButton 
        onClick={handleHomeClick}
        text="홈으로 가기"
      />
    </div>
  )
}