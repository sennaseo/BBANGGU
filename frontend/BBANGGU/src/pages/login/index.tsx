import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { User, Lock } from "lucide-react"
import { login } from "../../api/common/login/Login"
import { getKakaoLoginUrl } from "../../api/common/login/KakaoLogin"
import axios from "axios"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      alert('이메일과 비밀번호를 모두 입력해주세요.')
      return
    }

    setIsLoading(true)
    try {
      console.log('로그인 시도:', formData); // 요청 데이터 로그

      const response = await login(formData)
      
      console.log('로그인 응답:', response); // 성공 응답 로그
      
      // 로그인 성공 메시지
      alert(response.message)
      
      // 사용자 역할에 따른 리다이렉션
      if (response.data === 'OWNER') {
        console.log('점주로 로그인 성공, 리다이렉트: /owner/main');
        navigate('/owner/main')
      } else if (response.data === 'USER') {
        console.log('사용자로 로그인 성공, 리다이렉트: /user/main');
        navigate('/user')
      } else {
        console.log('역할 없음, 기본 페이지로 리다이렉트');
        navigate('/')
      }
    } catch (error) {
      console.error('로그인 에러:', error); // 에러 로그
      if (axios.isAxiosError(error)) {
        console.error('상세 에러 정보:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('로그인 중 오류가 발생했습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleKakaoLogin = async () => {
    setIsLoading(true)
    try {
      const response = await getKakaoLoginUrl()
      if (response.data) {
        window.location.href = response.data
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('카카오 로그인 중 오류가 발생했습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white px-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-[500px] space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              placeholder="이메일"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full h-14 pl-12 pr-4 bg-gray-50 rounded-xl outline-none text-base placeholder:text-gray-400 border border-gray-200 focus:border-[#FF9F43] transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full h-14 pl-12 pr-4 bg-gray-50 rounded-xl outline-none text-base placeholder:text-gray-400 border border-gray-200 focus:border-[#FF9F43] transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#FF9F43] text-white rounded-full font-medium text-base hover:bg-[#ff9029] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
            <button
              type="button"
              onClick={handleKakaoLogin}
              disabled={isLoading}
              className="w-full h-14 bg-[#FEE500] rounded-full font-medium text-[#000000] text-base flex items-center justify-center gap-2 hover:bg-[#ffd900] transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
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
          <button 
            type="button" 
            onClick={() => navigate("/signup")} 
            disabled={isLoading}
            className="hover:text-[#FF9F43] transition-colors disabled:hover:text-gray-500"
          >
            회원가입
          </button>
          <div className="text-gray-300">|</div>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            disabled={isLoading}
            className="hover:text-[#FF9F43] transition-colors disabled:hover:text-gray-500"
          >
            비밀번호 찾기
          </button>
        </div>
      </div>
    </div>
  )
}