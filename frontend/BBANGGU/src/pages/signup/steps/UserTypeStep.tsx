import { useState, useEffect } from "react"
import { User, Store } from "lucide-react"

interface UserTypeStepProps {
  selectedType: "customer" | "owner" | null
  onSelect: (type: "customer" | "owner") => void
}

export function UserTypeStep({ selectedType, onSelect }: UserTypeStepProps) {
  const [descriptionFontSize, setDescriptionFontSize] = useState("text-[13px]")

  useEffect(() => {
    const checkTextFit = () => {
      const testElement = document.createElement("span")
      testElement.style.visibility = "hidden"
      testElement.style.whiteSpace = "nowrap"
      testElement.style.position = "absolute"
      testElement.className = "text-[13px]"
      testElement.textContent = "저렴하게 맛있는 빵 찾기"
      document.body.appendChild(testElement)

      const buttonWidth = document.querySelector("button")?.offsetWidth || 0
      if (testElement.offsetWidth > buttonWidth - 32) {
        // 32px for padding
        setDescriptionFontSize("text-[11px]")
      }

      document.body.removeChild(testElement)
    }

    checkTextFit()
    window.addEventListener("resize", checkTextFit)
    return () => window.removeEventListener("resize", checkTextFit)
  }, [])

  return (
    <div className="space-y-6">
        
      <h2 className="text-xl font-bold mt-6">빵구, 어떻게 즐기실래요?</h2>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onSelect("customer")}
          className={`aspect-square rounded-2xl border-2 p-6 flex flex-col items-center justify-center gap-4 transition-colors
            ${
              selectedType === "customer" ? "bg-[#FF9F43] border-[#FF9F43] text-white" : "border-gray-200 text-gray-800"
            }`}
        >
          <User className="w-16 h-16 mb-3" />
          <div className="text-center px-4">
            <p
              className={`${descriptionFontSize} mb-1 whitespace-nowrap ${selectedType === "customer" ? "text-white" : "text-gray-600"}`}
            >
              저렴하게 맛있는 빵 찾기
            </p>
            <p className="text-[15px] font-bold">일반 사용자</p>
          </div>
        </button>

        <button
          onClick={() => onSelect("owner")}
          className={`aspect-square rounded-2xl border-2 p-6 flex flex-col items-center justify-center gap-4 transition-colors
            ${selectedType === "owner" ? "bg-[#FF9F43] border-[#FF9F43] text-white" : "border-gray-200 text-gray-800"}`}
        >
          <Store className="w-16 h-16 mb-3" />
          <div className="text-center px-4">
            <p
              className={`${descriptionFontSize} mb-1 whitespace-nowrap ${selectedType === "owner" ? "text-white" : "text-gray-600"}`}
            >
              남은 빵 알뜰히 판매하기
            </p>
            <p className="text-[15px] font-bold">가게 사장님</p>
          </div>
        </button>
      </div>
    </div>
  )
}

