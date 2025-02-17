import { ChevronLeft, Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { userProfileEditService } from "../../../../services/user/profileedit/userprofileEditService"
import { getUserProfile } from "../../../../services/user/mypage/usermypageServices"

export function UserEditProfile() {
  const navigate = useNavigate()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
  })

  // 사용자 정보를 API로부터 가져오는 useEffect
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserProfile() // 사용자 정보 조회 API 호출
        const userData = response[0] // API 응답에서 사용자 데이터 가져오기
        setFormData({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          currentPassword: "",
          newPassword: "",
        })
        console.log("userData", userData)
      } catch (error) {
        console.error('사용자 정보 조회 중 오류 발생:', error)
      }
    }

    fetchUserData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // API 호출하여 프로필 업데이트
      const updatedData = {
        name: formData.name,
        phone: formData.phone,
        // 추가적인 필드가 필요할 경우 여기에 추가
        // 예: addressRoad: formData.addressRoad, addressDetail: formData.addressDetail
      }

      await userProfileEditService.updateUserProfile(updatedData) // formData를 전달
      navigate(-1) // 성공적으로 업데이트 후 이전 페이지로 이동
    } catch (error) {
      console.error('프로필 수정 중 오류 발생:', error)
    }
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
                <path d="M19 3H5C4.9 3 4 3.89543 4 5V19C4 20.1046 4.9 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="#666666" strokeWidth="2"/>
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