import { ArrowLeft } from "lucide-react"
import type React from "react"

interface SignupLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  bottomButton: React.ReactNode
  onBack: () => void
}

export function SignupLayout({ children, bottomButton, onBack }: SignupLayoutProps) {

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="relative h-[52px] flex items-center border-b border-gray-100">
        <button onClick={onBack} className="p-3 text-gray-800">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col px-5">{children}</main>

      {/* Bottom Button */}
      {bottomButton && <div className="px-5 py-6">{bottomButton}</div>}
    </div>
  )
}

