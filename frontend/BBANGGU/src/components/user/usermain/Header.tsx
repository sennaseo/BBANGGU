import { BellIcon, ShoppingBagIcon } from "@heroicons/react/24/outline"
import { useNavigate } from "react-router-dom"

export default function Header() {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="flex items-center justify-between px-5 h-[56px]">
        <h1 className="text-[20px] font-extrabold text-[#454545]">BBANGGU</h1>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center">
            <BellIcon className="w-6 h-6 text-[#454545]" 
            onClick={() => navigate('/user/mypage/notifications')}
            />
          </button>
          <button className="w-10 h-10 flex items-center justify-center">
            <ShoppingBagIcon className="w-6 h-6 text-[#454545]" 

            onClick={() => navigate('/user/mypage/reservations')}/>
          </button>
        </div>
      </div>
    </header>
  )
}

