import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { InputField } from "../../components/signup/InputField"
import { Button } from "../../components/signup/Button"
import { PasswordApi } from "../../api/common/changepassword/PasswordApi"
import { X, ChevronLeft } from "lucide-react"

export default function ChangePasswordPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showVerificationField, setShowVerificationField] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [verificationMessage, setVerificationMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEmailVerification = async () => {
    setIsLoading(true)
    try {
      const response = await PasswordApi.requestReset(formData.email)
      setShowVerificationField(true)
      setVerificationMessage("인증번호가 이메일로 전송되었습니다.")
    } catch (error: any) {
      console.error('비밀번호 초기화 요청 에러:', error)
      setVerificationMessage(error.message || "인증번호 전송에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    setIsLoading(true)
    try {
      // TODO: 인증번호 확인 API 호출
      setIsVerified(true)
    } catch (error) {
      console.error(error)
      alert("인증번호가 일치하지 않습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }

    if (formData.newPassword.length < 8) {
      alert("비밀번호는 8자 이상이어야 합니다.")
      return
    }

    setIsLoading(true)
    try {
      const response = await PasswordApi.confirmReset(formData.email, formData.newPassword)
      setShowSuccessModal(true)
    } catch (error: any) {
      console.error('비밀번호 변경 에러:', error)
      alert(error.message || "비밀번호 변경에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const isEmailValid = formData.email.includes("@") && formData.email.includes(".")

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[430px] mx-auto relative">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 bg-white">
        <div className="flex items-center h-14 px-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold mr-8">
            비밀번호 변경
          </h1>
        </div>
      </header>

      {/* Main content */}
      <div className="flex justify-center mt-20 mb-10">
        <img
          src="/icon/bbanggu-icon.png"
          alt="빵꾸 아이콘"
          className="w-[150px] h-24 object-contain"
        />
      </div>

      <main className="flex-1 flex flex-col justify-start px-8">
        <form onSubmit={handleSubmit} className="w-full max-w-[500px] space-y-6">
          <InputField
            label="이메일"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일을 입력해주세요"
            disabled={showVerificationField}
            actionButton={
              !showVerificationField && (
                <Button
                  variant="secondary"
                  fullWidth={false}
                  className="px-3 rounded-lg"
                  disabled={!isEmailValid || isLoading}
                  onClick={handleEmailVerification}
                >
                  인증요청
                </Button>
              )
            }
          />
          {verificationMessage && (
            <p className={`text-sm ${verificationMessage.includes('실패') ? 'text-red-500' : 'text-green-600'}`}>
              {verificationMessage}
            </p>
          )}

          {showVerificationField && !isVerified && (
            <InputField
              label="인증번호"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleChange}
              placeholder="인증번호를 입력해주세요"
              actionButton={
                <Button
                  variant="secondary"
                  fullWidth={false}
                  className="px-3 rounded-lg"
                  disabled={!formData.verificationCode || isLoading}
                  onClick={handleVerifyCode}
                >
                  확인
                </Button>
              }
            />
          )}

          {isVerified && (
            <>
              <InputField
                label="새 비밀번호"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="새 비밀번호를 입력해주세요"
              />
              <InputField
                label="비밀번호 확인"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력해주세요"
              />
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={!formData.newPassword || !formData.confirmPassword || isLoading}
                >
                  {isLoading ? "변경 중..." : "비밀번호 변경"}
                </Button>
              </div>
            </>
          )}
        </form>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-[400px]">
            <div className="flex justify-end">
              <button onClick={() => {
                setShowSuccessModal(false)
                navigate("/login")
              }}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="text-center py-4">
              <h2 className="text-xl font-semibold mb-2">비밀번호 변경 완료!</h2>
              <p className="text-gray-600 mb-6">
                비밀번호가 성공적으로 변경되었습니다!<br />
                로그인을 다시 시도해보세요.
              </p>
              <Button
                onClick={() => {
                  setShowSuccessModal(false)
                  navigate("/login")
                }}
              >
                로그인하러 가기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
