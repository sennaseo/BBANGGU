import { ChevronLeft, Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export function UserEditProfile() {
  const navigate = useNavigate()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "이름",
    email: "dmscks312@gmail.com",
    phone: "010-1234-1234",
    profileImage: "",
    currentPassword: "",
    newPassword: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 회원정보 수정 API 호출
    navigate(-1)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-5 relative border-b border-gray-100">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold absolute left-1/2 -translate-x-1/2">회원정보수정</h1>
        <div className="w-6"></div>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="p-5 space-y-6">
        {/* 이름 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#333333]">이름</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#fc973b]"
          />
        </div>

        {/* 이메일 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#333333]">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#fc973b]"
          />
        </div>

        {/* 전화번호 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#333333]">전화번호</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#fc973b]"
          />
        </div>

        {/* 프로필 사진 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#333333]">프로필 사진</label>
          <div className="w-full p-4 rounded-xl border border-gray-200 flex items-center justify-center">
            <button type="button" className="text-[#666666]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#666666" strokeWidth="2"/>
                <path d="M12 8V16M8 12H16" stroke="#666666" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 비밀번호 변경 */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#333333]">비밀번호 변경</h3>
          
          {/* 현재 비밀번호 */}
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              placeholder="현재 비밀번호 입력"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#fc973b]"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showCurrentPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* 새 비밀번호 */}
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              placeholder="새 비밀번호 입력"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#fc973b]"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showNewPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* 저장하기 버튼 */}
        <button
          type="submit"
          className="w-full bg-[#fc973b] text-white py-4 rounded-full font-medium mt-8"
        >
          저장하기
        </button>
      </form>
    </div>
  )
} 