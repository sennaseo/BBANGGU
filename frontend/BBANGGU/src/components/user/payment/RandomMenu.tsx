import PaymentButton from "./common/PaymentButton"

interface RandomMenuProps {
    onConfirm: () => void
  }
  
  export function RandomMenu({ onConfirm }: RandomMenuProps) {
    return (
      <div className="flex flex-col items-center min-h-screen px-5 pb-20">
        <div className="flex-1 flex flex-col items-center justify-center translate-y-10">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-KuKR0pcNQ2KgdZPheKymyZin1cj9Ny.png"
            alt="랜덤 메뉴"
            className="w-48 h-48 mb-8"
          />
          <h2 className="text-xl font-bold mb-4">랜덤메뉴가 담기는 빵꾸러미예요</h2>
          <p className="text-center text-gray-600 mb-20">
            빵꾸러미에는 당일 판매지 않은 상품이
            <br />
            랜덤으로 담기게 된답니다!
            <br />
            <br />
            만일 특정 제품에 대한 알러지나 질문이 있다면
            <br />
            가게로 문의해주세요!
          </p>
        </div>
        <PaymentButton onClick={onConfirm} text="확인" />
      </div>
    )
  }
  
  