import { useNavigate } from "react-router-dom"

export default function OrderButton() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/user/payment")
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white py-4 border-t border-gray-200">
      <div className="mx-auto max-w-[600px] px-[20px]">
        <button
          onClick={handleClick}
          className="w-full rounded-xl bg-orange-400 py-[15px] text-center font-bold text-white transition-colors hover:bg-orange-500 text-[14px]"
        >
          빵꾸러미 주문하기
        </button>
      </div>
    </div>
  )
}

