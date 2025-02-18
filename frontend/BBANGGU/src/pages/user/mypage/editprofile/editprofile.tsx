import { ChevronLeft, Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { getUserInfo, updatePassword } from "../../../../api/user/user"
import { useDaumPostcodePopup } from 'react-daum-postcode';

export function UserEditProfile() {
  const navigate = useNavigate()
  
  // 기존 formData 상태 외에 최초 사용자 정보를 저장하기 위한 상태 추가
  const [initialData, setInitialData] = useState({
    name: "",
    phone: "",
    addressRoad: "",
    addressDetail: "",
  })

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    addressRoad: "",
    addressDetail: "",
    originPassword: "",
    newPassword: "",
  })

  // 사용자 정보를 API로부터 가져오는 useEffect
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserInfo() // 사용자 정보 조회 API 호출
        const userData = response // API 응답에서 사용자 데이터 가져오기
        setFormData({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          addressRoad: userData.addressRoad ? userData.addressRoad : "",
          addressDetail: userData.addressDetail ? userData.addressDetail : "",
          originPassword: "",
          newPassword: "",
        })
        // 최초 사용자 정보 저장
        setInitialData({
          name: userData.name,
          phone: userData.phone,
          addressRoad: userData.addressRoad ? userData.addressRoad : "",
          addressDetail: userData.addressDetail ? userData.addressDetail : "",
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
      // 변경된 데이터만 추려내기
      const changedData: { [key: string]: string } = {}
      if (formData.name.trim() !== initialData.name.trim()) {
        changedData.name = formData.name.trim()
      }
      if (formData.phone.trim() !== initialData.phone.trim()) {
        changedData.phone = formData.phone.trim()
      }
      if (formData.addressRoad.trim() !== initialData.addressRoad.trim()) {
        changedData.addressRoad = formData.addressRoad.trim()
      }
      if (formData.addressDetail.trim() !== initialData.addressDetail.trim()) {
        changedData.addressDetail = formData.addressDetail.trim()
      }

      // 변경된 필드가 있을 때만 프로필 업데이트 API 호출
      // if (Object.keys(changedData).length > 0) {
      //   console.log("changedData", changedData)
      //   await updateUserInfo(changedData); // 변경된 데이터 그대로 전송
      // } else {
      //   console.log("변경된 필드가 없습니다.")
      // }

      // 비밀번호 업데이트: 두 필드 모두 입력된 경우에만 호출
      if (formData.originPassword.trim() !== "" && formData.newPassword.trim() !== "") {
        const passwordData = {
          email: formData.email,
          originPassword: formData.originPassword,
          newPassword: formData.newPassword,
        }
        await updatePassword(passwordData)
      }

      navigate(-1) // 성공적으로 업데이트 후 이전 페이지로 이동
    } catch (error) {
      console.error('프로필 수정 중 오류 발생:', error)
    }
  }

  interface AddressBtnProps {
    scriptUrl?: string,
    onComplete: (address: string) => void
  }
  
  const AddressBtn = ({scriptUrl, onComplete}: AddressBtnProps) => {
    const open = useDaumPostcodePopup(scriptUrl);
  
    const handleComplete = (data: any) => {
      let fullAddress = data.address;
      let extraAddress = "";
  
      if (data.addressType === "R") {
        if (data.bname !== "") {
          extraAddress += data.bname;
        }
        if (data.buildingName !== "") {
          extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
        }
        fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
      }
  
      onComplete(fullAddress);
    };
  
    const handleOnClickAddressBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      open({ onComplete: handleComplete });
    };
  
    return (
      <button onClick={handleOnClickAddressBtn} className="w-full max-w-[100px] bg-[#fc973b] text-white rounded-xl">
        주소 검색
      </button>
    );
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

        {/* 이메일 - 수정 불가 처리 위해 readOnly 추가 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#333333]">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
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

        {/* 주소 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#333333]">주소</label>
          <div className="flex">
            <input
              type="text"
              name="addressRoad"
              value={formData.addressRoad}
              onChange={handleInputChange}
              className="w-full p-3 rounded-xl mr-2 border border-gray-200 focus:outline-none focus:border-[#fc973b]"
            />
            <AddressBtn onComplete={(address) => setFormData(prev => ({ ...prev, addressRoad: address }))} />
          </div>
        </div>

        {/* 상세주소 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#333333]">상세주소</label>
          <div className="flex">
            <input
              type="text"
              name="addressDetail"
              value={formData.addressDetail}
              onChange={handleInputChange}
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[#fc973b]"
            />
          </div>
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
              name="originPassword"
              placeholder="현재 비밀번호 입력"
              value={formData.originPassword}
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
          className="fixed bottom-5 left-0 right-0 max-w-[400px] mx-auto w-full bg-[#fc973b] text-white py-4 rounded-xl font-medium mt-8"
        >
          저장하기
        </button>
      </form>
    </div>
  )}