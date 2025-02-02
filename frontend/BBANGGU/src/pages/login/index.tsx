import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { User, Lock } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  })
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt with:", formData)
  }

  return (
    <div className="min-h-screen bg-white px-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-[500px] space-y-6">
        {/* <h1 className="text-3xl font-bold text-center text-gray-800">로그인</h1> */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="id"
              placeholder="ID"
              value={formData.id}
              onChange={handleChange}
              className="w-full h-14 pl-12 pr-4 bg-gray-50 rounded-xl outline-none text-base placeholder:text-gray-400 border border-gray-200 focus:border-[#FF9F43] transition-colors"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              name="password"
              placeholder="PW"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-14 pl-12 pr-4 bg-gray-50 rounded-xl outline-none text-base placeholder:text-gray-400 border border-gray-200 focus:border-[#FF9F43] transition-colors"
            />
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="submit"
              className="w-full h-14 bg-[#FF9F43] text-white rounded-full font-medium text-base hover:bg-[#ff9029] transition-colors"
            >
              로그인
            </button>
            <button
              type="button"
              className="w-full h-14 bg-[#FEE500] rounded-full font-medium text-[#000000] text-base flex items-center justify-center gap-2 hover:bg-[#ffd900] transition-colors"
            >
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%20633268-bowb3Uiun1OO8jXhzPmxfzIBQicmXx.png"
                alt="카카오"
                className="w-6 h-6"
              />
              카카오톡으로 로그인
            </button>
          </div>
        </form>

        <div className="flex justify-center space-x-4 text-sm text-gray-500">
          <button type="button" onClick={() => navigate("/signup")} className="hover:text-[#FF9F43] transition-colors">
            회원가입
          </button>
          <div className="text-gray-300">|</div>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="hover:text-[#FF9F43] transition-colors"
          >
            비밀번호 찾기
          </button>
        </div>
      </div>
    </div>
  )
}

