interface PaymentMethodProps {
    onConfirm: () => void
  }
  
  export function PaymentMethod({ onConfirm }: PaymentMethodProps) {
    return (
      <div className="flex flex-col min-h-screen px-5 pt-20">
        <h2 className="text-xl font-bold mb-6">결제 방법</h2>
  
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button className="px-4 py-2 border rounded-full min-w-fit text-sm border-[#FF9F43] text-[#FF9F43]">
              신용/체크카드
            </button>
            <button className="px-4 py-2 border rounded-full min-w-fit text-sm bg-[#03C75A] text-white">
              네이버페이
            </button>
            <button className="px-4 py-2 border rounded-full min-w-fit text-sm bg-[#FFEB00]">카카오페이</button>
            <button className="px-4 py-2 border rounded-full min-w-fit text-sm bg-[#0064FF] text-white">토스페이</button>
          </div>
  
          <div className="border rounded-lg p-4">
            <label className="block text-sm mb-2">카드사 선택</label>
            <select className="w-full p-2 border rounded">
              <option>카드를 선택해주세요</option>
            </select>
          </div>
  
          <button className="text-sm text-gray-600 flex items-center gap-1">신용카드 무이자 할부 안내 {">"}</button>
  
          <label className="flex items-center gap-2">
            <input type="checkbox" className="w-5 h-5 accent-[#FF9F43]" />
            <span className="text-sm text-blue-500">[필수] 결제 서비스 이용 약관, 개인정보 처리 등의</span>
          </label>
        </div>
  
        <button
          onClick={onConfirm}
          className="fixed bottom-6 left-6 right-6 max-w-[430px] mx-auto bg-[#FF9F43] text-white py-4 rounded-xl"
        >
          4,900원 결제
        </button>
      </div>
    )
  }
  
  