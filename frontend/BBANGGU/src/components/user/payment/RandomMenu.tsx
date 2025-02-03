interface RandomMenuProps {
    onConfirm: () => void
  }
  
  export function RandomMenu({ onConfirm }: RandomMenuProps) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-5">
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
        <button
          onClick={onConfirm}
          className="fixed bottom-6 left-6 right-6 max-w-[430px] mx-auto bg-[#FF9F43] text-white py-4 rounded-xl"
        >
          확인
        </button>
      </div>
    )
  }
  
  