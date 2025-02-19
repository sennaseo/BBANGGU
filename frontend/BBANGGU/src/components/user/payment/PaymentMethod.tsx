import { useState } from "react"
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import PaymentButton from "./common/PaymentButton"

declare global {
  interface Window {
    TossPayments: any;
  }
}

interface PaymentMethodProps {
  totalPrice: number;
}

export function PaymentMethod({ totalPrice }: PaymentMethodProps) {
  const userInfo = useSelector((state: RootState) => state.user.userInfo)
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [isAgreed, setIsAgreed] = useState(false);

  const requestPayment = async () => {
    const clientKey = "test_ck_d46qopOB896qMYBeYgj53ZmM75y0"
    const customerKey = "106"; // userId 들어갈 예정
    const tossPayments = window.TossPayments(clientKey)
    
    // 전화번호에서 하이픈 제거
    const phoneNumber = userInfo?.phone?.replace(/-/g, "") || ""
    
    const paymentData = {
      method: "CARD",
      amount: {
        currency: "KRW",
        value: totalPrice,
      },
      orderId: crypto.randomUUID(),
      orderName: "빵꾸러미",
      successUrl: window.location.origin + "/payment/success",
      failUrl: window.location.origin + "/payment/fail",
      customerEmail: userInfo?.email || "",
      customerName: userInfo?.name || "",
      customerMobilePhone: phoneNumber,  // 하이픈이 제거된 전화번호 사용
      card: {
        useEscrow: false,
        flowMode: "DEFAULT",
        useCardPoint: false,
        useAppCardOnly: false,
      },
    }

    console.log("결제 요청 데이터:", paymentData)
    console.log("사용자 정보:", userInfo)
    console.log("변환된 전화번호:", phoneNumber)

    try {
      const payment = tossPayments.payment({ customerKey })
      await payment.requestPayment(paymentData)
    } catch (error) {
      console.error("결제 요청 실패:", error)
    }
  }

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-white pb-20">
      <div className="flex-1 px-5">
        <h2 className="text-xl font-bold mb-6">결제 방법</h2>

        {/* 신용·체크카드 섹션 */}
        <div className="mb-6">
          <button 
            className={`w-full p-3 border rounded-xl text-center mb-3 ${
              selectedMethod === 'card' ? 'border-[#FF9F43]' : 'border-[#F2F2F2]'
            }`}
            onClick={() => setSelectedMethod('card')}
          >
            신용·체크카드
          </button>
          <div className="grid grid-cols-3 gap-3">
            <button 
              className={`border rounded-xl p-4 flex flex-col items-center justify-center ${
                selectedMethod === 'naverpay' ? 'border-[#FF9F43]' : 'border-[#F2F2F2]'
              }`}
              onClick={() => setSelectedMethod('naverpay')}
            >
              <img src="../../../../dist/icons/payment/naverpay.png" alt="네이버페이" className="h-5" />
            </button>
            <button 
              className={`border rounded-xl p-4 flex flex-col items-center justify-center ${
                selectedMethod === 'kakaopay' ? 'border-[#FF9F43]' : 'border-[#F2F2F2]'
              }`}
              onClick={() => setSelectedMethod('kakaopay')}
            >
              <img src="../../../../dist/icons/payment/kakaopay.png" alt="카카오페이" className="h-10" />
            </button>
            <button 
              className={`border rounded-xl p-4 flex flex-col items-center justify-center ${
                selectedMethod === 'tosspay' ? 'border-[#FF9F43]' : 'border-[#F2F2F2]'
              }`}
              onClick={() => setSelectedMethod('tosspay')}
            >
              <img src="../../../../dist/icons/payment/tosspay.png" alt="토스페이" className="h-11" />
            </button>
          </div>
        </div>

        {/* 다른 결제수단 섹션 */}
        <div className="grid grid-cols-3 gap-3">
          <button 
            className={`border rounded-xl p-4 flex flex-col items-center justify-center ${
              selectedMethod === 'quick' ? 'border-[#FF9F43]' : 'border-[#F2F2F2]'
            }`}
            onClick={() => setSelectedMethod('quick')}
          >
            <span className="text-sm">퀵계좌이체</span>
          </button>
          <button 
            className={`border rounded-xl p-4 flex flex-col items-center justify-center ${
              selectedMethod === 'virtual' ? 'border-[#FF9F43]' : 'border-[#F2F2F2]'
            }`}
            onClick={() => setSelectedMethod('virtual')}
          >
            <span className="text-sm">가상계좌</span>
          </button>
          <button 
            className={`border rounded-xl p-4 flex flex-col items-center justify-center ${
              selectedMethod === 'phone' ? 'border-[#FF9F43]' : 'border-[#F2F2F2]'
            }`}
            onClick={() => setSelectedMethod('phone')}
          >
            <span className="text-sm">휴대폰</span>
          </button>
        </div>

        {/* 약관 동의 */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreement"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
              className="w-5 h-5 accent-[#FF9F43] rounded"
            />
            <label htmlFor="agreement" className="ml-2 flex-1 text-left text-sm text-gray-600 flex items-center">
              <span className="text-[#4285F4]">[필수]</span>
              <span className="ml-1">결제 서비스 이용 약관, 개인정보 처리 동의</span>
            </label>
            <svg className="w-4 h-4 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <PaymentButton 
        onClick={requestPayment}
        text={`${totalPrice.toLocaleString()}원 결제`}
      />
    </div>
  )
}
