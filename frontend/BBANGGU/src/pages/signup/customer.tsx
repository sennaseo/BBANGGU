import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/signup/Button"
import { InputField } from "../../components/signup/InputField"
import { PasswordStep } from "./steps/PasswordStep"
import { PhoneStep } from "./steps/PhoneStep"
// import { NameEmailStep } from "./steps/NameEmailStep"
import { SignupCompleteStep } from "./steps/SignupCompleteStep"
import { UserApi } from "../../api/common/signup/UserApi"

type SignupStep = "email" | "password" | "phone" | "complete"

export default function CustomerSignupPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<SignupStep>("email")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    emailVerificationCode: "",
    password: "",
    confirmPassword: "",
    phone: "",
    phoneVerificationCode: "",
  })
  const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [isPhoneVerificationSent, setIsPhoneVerificationSent] = useState(false)
  const [isPhoneVerified] = useState(false)

  // 버튼 variant 상태 추가
  const [buttonVariant, setButtonVariant] = useState<"primary" | "secondary">("primary")
  const [isConfirmButtonClicked, setIsConfirmButtonClicked] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEmailVerification = async () => {
    // 버튼 클릭 시 바로 인증 필드를 표시
    setIsEmailVerificationSent(true)
    // 이메일 전송시 버튼 스타일 변경
    setButtonVariant("secondary")
    try {
      await UserApi.sendEmailVerification(formData.email);
    } catch (error: any) {
      // 이메일 전송 실패 시 인증 필드를 숨김
      setIsEmailVerificationSent(false)
      if (error.code === 3001) {
        alert('너무 많은 요청을 보냈습니다. 나중에 다시 시도하세요.');
      } else {
        alert('인증번호 전송에 실패했습니다.');
      }
    }
  }

  const handleEmailVerificationSubmit = async () => {
    try {
      await UserApi.verifyEmail(formData.email, formData.emailVerificationCode);
      setIsEmailVerified(true);
    } catch (error: any) {
      if (error.code === 3002) {
        alert('인증번호가 일치하지 않습니다. 다시 확인해주세요.');
      } else if (error.code === 3004) {
        alert('이미 사용된 인증 코드입니다.');
      } else {
        alert('이메일 인증에 실패했습니다.');
      }
    }
  }

  const handlePasswordSubmit = () => {
    setCurrentStep("phone")
  }

  const handlePhoneVerification = () => {
    // TODO: Implement phone verification logic
    console.log("Sending verification SMS to:", formData.phone)
    setIsPhoneVerificationSent(true)
  }

  const handlePhoneVerificationSubmit = async () => {
    if (formData.phone) {
      try {
        await UserApi.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        });
        setCurrentStep("complete");
      } catch (error: any) {
        if (error.code === 1006) {
          alert('이미 사용 중인 이메일입니다.');
        } else if (error.code === 1008) {
          alert('이미 사용 중인 전화번호입니다.');
        } else {
          alert('회원가입에 실패했습니다.');
        }
      }
    }
  }

  const isEmailValid = formData.email.includes("@") && formData.email.includes(".")
  const isPasswordValid = formData.password.length >= 8
  const doPasswordsMatch = formData.password === formData.confirmPassword

  const handleBackClick = () => {
    switch (currentStep) {
      case "email":
        navigate("/signup")
        break
      case "password":
        setCurrentStep("email")
        break
      case "phone":
        setCurrentStep("password")
        break
      case "complete":
        setCurrentStep("phone")
        break
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case "email":
        return (
          <div className="pt-6">
            <h1 className="text-[22px] font-bold mb-2">이메일 입력</h1>
            <p className="text-[15px] text-gray-600 mb-6">원활한 서비스 이용을 위해 이메일 인증을 해주세요</p>
            <div className="space-y-6">
              <InputField label="이름" name="name" value={formData.name} onChange={handleChange} placeholder="홍길동" />
              <div className="space-y-2">
                <InputField
                  label="EMAIL"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="gildong123@gmail.com"
                  actionButton={
                    <Button
                      variant={buttonVariant}
                      fullWidth={false}
                      className="px-4 h-[38px] text-[14px] rounded-xl"
                      disabled={!isEmailValid || isEmailVerified}
                      onClick={handleEmailVerification}
                    >
                      {isEmailVerified ? "인증완료" : "인증요청"}
                    </Button>
                  }
                />
                {isEmailVerificationSent && !isEmailVerified && (
                  <p className="text-sm text-[#FF9F43]">이메일로 전송된 인증 코드를 입력해주세요.</p>
                )}
                {isEmailVerified && <p className="text-sm text-green-600">인증되었습니다!</p>}
              </div>
            </div>
            {isEmailVerificationSent && (
              <div className="mt-4">
                <InputField
                  label="인증번호"
                  name="emailVerificationCode"
                  value={formData.emailVerificationCode}
                  onChange={handleChange}
                  placeholder="인증번호 6자리 입력"
                  actionButton={
                    <Button
                      variant={isConfirmButtonClicked ? "secondary" : "primary"}
                      fullWidth={false}
                      className="px-4 h-[32px] text-sm rounded-xl"
                      onClick={() => {
                        handleEmailVerificationSubmit()
                        setIsConfirmButtonClicked(true)
                      }}
                      disabled={formData.emailVerificationCode.length !== 6}
                    >
                      확인
                    </Button>
                  }
                />
              </div>
            )}
          </div>
        )
      case "password":
        return (
          <div className="pt-8">
            <h1 className="text-[22px] font-bold mb-2">비밀번호 설정</h1>
            <p className="text-[15px] text-gray-600 mb-8">안전한 비밀번호를 입력해주세요</p>
            <PasswordStep formData={formData} onChange={handleChange} />
          </div>
        )
      case "phone":
        return (
          <div className="pt-8">
            <h1 className="text-[22px] font-bold mb-2">전화번호 입력</h1>
            <p className="text-[15px] text-gray-600 mb-8">원활한 서비스 이용을 위해 전화번호를 입력해주세요</p>
            <PhoneStep
              formData={{
                phone: formData.phone,
                verificationCode: formData.phoneVerificationCode,
              }}
              onChange={handleChange}
              onPhoneVerification={handlePhoneVerification}
              onVerificationSubmit={handlePhoneVerificationSubmit}
              isVerificationSent={isPhoneVerificationSent}
              isVerified={isPhoneVerified}
            />
          </div>
        )
      case "complete":
        return <SignupCompleteStep userName={formData.name} />
    }
  }

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="relative h-[52px] flex items-center border-b border-gray-100">
        <button onClick={handleBackClick} className="p-3 text-gray-800">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col px-5 pb-[80px]">{renderStep()}</main>

      {/* Bottom Button */}
      {currentStep !== "complete" && (
        <div className="fixed bottom-0 left-0 right-0 px-5 py-4 bg-white border-t border-gray-100 max-w-[430px] mx-auto rounded-xl">
          <Button
            variant={buttonVariant}
            onClick={
              currentStep === "email"
                ? () => {
                    setCurrentStep("password")
                    setButtonVariant("primary")
                  }
                : currentStep === "password"
                  ? handlePasswordSubmit
                  : handlePhoneVerificationSubmit
            }
            disabled={
              currentStep === "email"
                ? !isEmailVerified || !formData.name || !isEmailValid
                : currentStep === "password"
                  ? !isPasswordValid || !doPasswordsMatch
                  : !formData.phone
            }
          >
            다음
          </Button>
        </div>
      )}
    </div>
  )
}
