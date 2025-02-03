import { ArrowLeft } from "lucide-react"

interface HeaderProps {
  onBack: () => void
}

export function Header({ onBack }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="max-w-[430px] mx-auto flex items-center h-14 px-4">
        <button onClick={onBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-lg font-medium mr-10">예약하기</h1>
      </div>
    </header>
  )
}

