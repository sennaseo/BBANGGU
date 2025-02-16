import PaymentButton from "./common/PaymentButton"

interface PickupTimeProps {
    onConfirm: () => void
  }
  
  export function PickupTime({ onConfirm }: PickupTimeProps) {
    return (
      <div className="flex flex-col items-center min-h-screen px-5 pb-20">
        <div className="flex-1 flex flex-col items-center justify-center translate-y-10">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-irA9AQufK7fZoRdUliEDklgAJirkrd.png"
            alt="픽업 시간"
            className="w-48 h-48 mb-8"
          />
          <h2 className="text-xl font-bold mb-2">픽업시간에만 수령이 가능해요</h2>
          <p className="text-[#FF9F43] font-medium mb-4">픽업시간을 꼭 지켜주세요.</p>
          <p className="text-center text-gray-600 mb-20">
            매장의 원활한 운영과 신선한 빵 제공을 위해 정해진
            <br />
            시간 내에 방문해 주세요. 픽업 시간이 지나면 보관이
            <br />
            어려울 수 있어 유의 부탁드립니다.
          </p>
        </div>
        <PaymentButton onClick={onConfirm} text="확인" />
      </div>
    )
  }
  
  