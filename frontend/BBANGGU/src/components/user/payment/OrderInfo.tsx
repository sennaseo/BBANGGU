interface OrderInfoProps {
    onConfirm: () => void
  }
  
  export function OrderInfo({ onConfirm }: OrderInfoProps) {
    return (
      <div className="flex flex-col min-h-screen px-5 pt-20">
        <div className="flex flex-col items-center mb-8">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-LcIDET6EE2Q5geFDOtmxXiPxDePUxH.png"
            alt="취소 안내"
            className="w-32 h-32 mb-6"
          />
          <h2 className="text-xl font-bold mb-6">주문이 취소될 수 있어요</h2>
          <p className="text-center text-gray-600 mb-8">
            현재 만드는 음식을 정해드리고 신재만 모두 판매되면 수 있는 음식이 없어요
          </p>
        </div>
  
        <ul className="space-y-4 text-sm text-gray-600">
          <li>• 픽업 30분 전까지는 언제든 취소할 수 있어요</li>
          <li>• 취소가 안되었다면 30분 전 확정 알림을 보내드려요</li>
          <li>• 픽업 30분 전까지는 언제든 취소할 수 있어요</li>
          <li>• 취소가 안되었다면 30분 전 확정 알림을 보내드려요</li>
        </ul>
  
        <button
          onClick={onConfirm}
          className="fixed bottom-6 left-6 right-6 max-w-[430px] mx-auto bg-[#FF9F43] text-white py-4 rounded-xl"
        >
          확인
        </button>
      </div>
    )
  }
  