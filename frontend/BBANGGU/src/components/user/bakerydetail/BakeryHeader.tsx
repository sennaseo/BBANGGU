import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function BakeryHeader() {
  const navigate = useNavigate()

  return (
    <header className="fixed top-[20px] z-50 w-full">
      <div className="flex items-center px-5 md:pt-0">
        <button onClick={() => navigate(-1)} className="rounded-full p-2 hover:bg-gray-100 backdrop-blur-md">
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>
      </div>
    </header>
  )
}

