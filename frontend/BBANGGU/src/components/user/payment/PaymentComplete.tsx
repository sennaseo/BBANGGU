import PaymentButton from "./common/PaymentButton"

interface PaymentCompleteProps {
  onConfirm: () => void;
}

export function PaymentComplete({ onConfirm }: PaymentCompleteProps) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-5 pb-20">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5-MljMznmeK0GCp12HxQqCDOXkyoJ6Cr.png"
          alt="완료"
          className="w-32 h-32 mb-8"
        />
        <h2 className="text-2xl font-bold mb-4">예약이 완료되었습니다!</h2>
        <p className="text-center text-gray-600 mb-20">
          감사합니다 :) 신은천님 덕분에
          <br />이 음식은 더 이상 버려지지 않게 되었어요!
        </p>
        <PaymentButton onClick={onConfirm} text="홈으로" />
      </div>
    )
  }
  
  