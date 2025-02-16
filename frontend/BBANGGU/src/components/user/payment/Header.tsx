import { ArrowLeft } from "lucide-react"

interface HeaderProps {
  onBack: () => void
}

export function Header({ onBack }: HeaderProps) {
  return (
    <div className="fixedtop-0 w-full bg-white py-4 border-t border-gray-200 max-w-[440px]">
      <div className="max-w-[430px] mx-auto flex items-center h-13 px-[20px]">
        <button onClick={onBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-lg font-medium mr-10">예약하기</h1>
      </div>
    </div>
  )
}

