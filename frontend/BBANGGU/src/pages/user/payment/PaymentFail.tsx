import { useNavigate } from "react-router-dom"
import PaymentButton from "../../../components/user/payment/common/PaymentButton"

export function PaymentFail() {
  const navigate = useNavigate()

  const handleRetry = () => {
    navigate(-1)  // 이전 페이지(결제 페이지)로 돌아가기
  }

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-white pb-20">
      <div className="flex-1 px-5 flex flex-col items-center justify-center" style={{ minHeight: "calc(100vh - 80px)" }}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-4 text-red-500">결제에 실패했습니다</h2>
          <p className="text-gray-600">다시 시도해주세요</p>
        </div>

        <PaymentButton 
          onClick={handleRetry}
          text="다시 시도하기"
        />
      </div>
    </div>
  )
}