import { useState, useEffect, useRef } from "react"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/signup/Button"
import { InputField } from "../../components/signup/InputField"
import { PasswordStep } from "./steps/PasswordStep"
import { PhoneStep } from "./steps/PhoneStep"
import { StoreInfoStep } from "./steps/StoreInfoStep"
import { SettlementInfoStep } from "./steps/SettlementInfoStep"
import { SignupCompleteStep } from "./steps/SignupCompleteStep"
import { OwnerApi } from "../../api/common/signup/OwnerApi"

type SignupStep = "email" | "password" | "phone" | "store" | "settlement" | "complete"

interface FormData {
  userId?: number
  name: string
  email: string
  emailVerificationCode: string
  password: string
  confirmPassword: string
  phone: string
  phoneVerificationCode: string
  storeName: string
  storeAddress: string
  storeAddressDetail: string
  storePhoto: string
  accountName: string
  accountHolder: string
  accountNumber: string
  taxEmail: string
  businessRegistrationNumber: string;
  storeDescription: string
  storePhone: string
  bankName: string
  businessLicenseFileUrl: string
}

const initialFormData: FormData = {
  userId: undefined,
  name: "",
  email: "",
  emailVerificationCode: "",
  password: "",
  confirmPassword: "",
  phone: "",
  phoneVerificationCode: "",
  storeName: "",
  storeAddress: "",
  storeAddressDetail: "",
  storePhoto: "",
  accountName: "",
  accountHolder: "",
  accountNumber: "",
  taxEmail: "",
  businessRegistrationNumber: "", 
  storeDescription: "",
  storePhone: "",
  bankName: "",
  businessLicenseFileUrl: "",
}

export default function OwnerSignupPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<SignupStep>("email")
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [isPhoneVerificationSent, setIsPhoneVerificationSent] = useState(false)
  const [isPhoneVerified] = useState(false)

    // 버튼 variant 상태 추가
    const [buttonVariant, setButtonVariant] = useState<"primary" | "secondary">("primary")
    const [isConfirmButtonClicked, setIsConfirmButtonClicked] = useState(false)

  const mainRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if ((currentStep === "store" || currentStep === "settlement") && mainRef.current) {
      console.log("Scrolling to top:", mainRef.current);
      setTimeout(() => {
        if (mainRef.current) {
          mainRef.current.scrollTo({ top: 0, behavior: "smooth" }); // ✅ 확실하게 스크롤 적용
        }
      }, 0);
    }
  }, [currentStep]);

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
    setButtonVariant("secondary")
    try {
      await OwnerApi.sendEmailVerification(formData.email);
      // 이메일 전송 성공 시 버튼 스타일 변경 (필요 시 추가)
    } catch (error: any) {
      // 이메일 전송 실패 시 인증 필드를 숨김
      setButtonVariant("primary")
      if (error.code === 3001) {
        alert('너무 많은 요청을 보냈습니다. 나중에 다시 시도하세요.');
      } else if (error.code === 1006) {
        alert('이미 사용 중인 이메일입니다.');
        setIsEmailVerificationSent(false)
      } else {
        alert('인증번호 전송에 실패했습니다.');
      }
    }
  }

  const handleEmailVerificationSubmit = async () => {
    try {
      await OwnerApi.verifyEmail(formData.email, formData.emailVerificationCode);
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
        // 회원가입 진행
        const userResponse = await OwnerApi.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        });
        
        // userId를 state에 저장
        setFormData(prev => ({
          ...prev,
          userId: userResponse.data.userId
        }));
        
        setCurrentStep("store");
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
  };

  const handleStoreInfoSubmit = async () => {
    try {
      if (!formData.userId) {
        throw new Error('회원 정보가 없습니다.');
      }

      const storeData = {
        userId: formData.userId,
        name: formData.storeName,
        description: formData.storeDescription,
        businessRegistrationNumber: formData.businessRegistrationNumber,
        addressRoad: formData.storeAddress,
        addressDetail: formData.storeAddressDetail,
        storePhoto: formData.storePhoto,
      };

 
      let bakeryImageUrl: File | undefined = undefined;
  
      if (formData.storePhoto && typeof formData.storePhoto === "string") {
        const res = await fetch(formData.storePhoto);
        const blob = await res.blob();
        bakeryImageUrl = new File([blob], 'store-photo.jpg', { type: blob.type });
      }
  
      console.log('Store data being sent to API:', storeData);  // API로 보내는 데이터 확인
  
      const response = await OwnerApi.registerStore({
        ...storeData,
        bakeryImage: bakeryImageUrl,  // File 객체로 전달
      });
  
      console.log('API response:', response);  // API 응답 확인
      setCurrentStep("settlement");
    } catch (error: any) {
      console.error('Store registration error details:', error.response?.data || error);
      throw error;  // 에러를 다시 던져서 상위에서 처리
    }
  };

  const handleSettlementInfoSubmit = async () => {
    try {
      if (!formData.userId) {
        throw new Error("회원 정보가 없습니다.");
      }
  
      // 🔹 FormData 객체 생성
      const formDataToSend = new FormData();
  
      const settlementData = {
        userId: formData.userId,
        bankName: formData.bankName,
        accountHolderName: formData.accountHolder,
        accountNumber: formData.accountNumber,
        emailForTaxInvoice: formData.taxEmail,
      };
      console.log("🔹 정산 정보:", settlementData);
      console.log("image", formData.businessLicenseFileUrl)
  
      // 🔹 JSON 데이터를 Blob으로 변환 후 추가
      formDataToSend.append(
        "settlement",
        new Blob([JSON.stringify(settlementData)], { type: "application/json" })
      );
  
      // 🔹 파일이 문자열(URL)인 경우 변환하여 추가
      if (formData.businessLicenseFileUrl) {
        if (typeof formData.businessLicenseFileUrl === "string") {
          const res = await fetch(formData.businessLicenseFileUrl);
          const blob = await res.blob();
          formDataToSend.append(  
          "businessLicenseFileUrl",
            new File([blob], `businessLicenseFile.${blob.type.split("/")[1] || "jpg"}`, { type: blob.type })
          );
        } else {
          // 🔹 파일 객체일 경우 그대로 추가
          formDataToSend.append("businessLicenseFile", formData.businessLicenseFileUrl);
        }
      }
  
      console.log("Settlement data being sent:", settlementData);
  
      // 🔹 API 호출 (FormData를 그대로 전달)
      const response = await OwnerApi.registerSettlement(formDataToSend);
      console.log("Settlement registration response:", response);
  
      setCurrentStep("complete");
    } catch (error: any) {
      console.error("Settlement registration error:", error.response?.data || error);
  
      if (error.response?.status === 500) {
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        alert("정산 정보 등록에 실패했습니다. 입력하신 정보를 다시 확인해주세요.");
      }
    }
  };
  
  
  const isEmailValid = formData.email.includes("@") && formData.email.includes(".")
  const isPasswordValid = formData.password.length >= 8
  const doPasswordsMatch = formData.password === formData.confirmPassword

  const handleBackClick = () => {
    switch (currentStep) {
      case "email":
        navigate("/signup")  // 첫 단계에서는 회원가입 유형 선택 페이지로
        break
      case "password":
        setCurrentStep("email")
        break
      case "phone":
        setCurrentStep("password")
        break
      case "store":
        setCurrentStep("phone")
        break
      case "settlement":
        setCurrentStep("store")
        break
      case "complete":
        setCurrentStep("settlement")
        break
    }
  }

  const handleNextClick = async () => {
    try {
      switch (currentStep) {
        case "email":
          setCurrentStep("password");
          break;
        case "password":
          handlePasswordSubmit();
          break;
        case "phone":
          await handlePhoneVerificationSubmit();
          break;
        case "store":
          await handleStoreInfoSubmit();
          break;
        case "settlement":
          await handleSettlementInfoSubmit();
          break;
      }
    } catch (error: any) {
      if (error.code === 2001) {
        alert(`'${formData.storeName}' 은(는) 이미 사용 중인 가게 이름입니다. 다른 이름을 입력해주세요.`);
      } else if (error.code === 2000) {
        alert('이미 존재하는 사업자 등록 번호입니다. 다른 번호를 입력해주세요.');
      } else {
        alert(error.message || '처리 중 오류가 발생했습니다.');
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "email":
        return (
          <div className="space-y-6">
            <h1 className="text-[22px] font-bold">이메일 입력</h1>
            <p className="text-[15px] text-gray-600">원활한 서비스 이용을 위해 이메일 인증을 해주세요</p>
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
          <div className="space-y-6">
            <h1 className="text-[22px] font-bold">비밀번호 설정</h1>
            <p className="text-[15px] text-gray-600">안전한 비밀번호를 입력해주세요</p>
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
      case "store":
        return (
          <div className="max-h-[calc(100vh-180px)] overflow-y-auto
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:rounded-full
              [&::-webkit-scrollbar-track]:bg-gray-100
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-gray-300
              dark:[&::-webkit-scrollbar-track]:bg-neutral-700
              dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            <div className="mr-2">
              <h1 className="text-[22px] font-bold">가게 정보</h1>
              <p className="text-[15px] text-gray-600 mb-4">입력하신 내용은 언제든지 변경 가능해요.</p>
              <StoreInfoStep formData={formData} onChange={handleChange} />
            </div>
          </div>
        )
      case "settlement":
        return (
          <div className="max-h-[calc(100vh-180px)] overflow-y-auto
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:rounded-full
              [&::-webkit-scrollbar-track]:bg-gray-100
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-gray-300
              dark:[&::-webkit-scrollbar-track]:bg-neutral-700
              dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            <div className="mr-2">
              <h1 className="text-[22px] font-bold">정산 정보</h1>
              <p className="text-[15px] text-gray-600 mb-4">모든 항목이 입력되어야, 정산금이 이체됩니다.</p>
              <SettlementInfoStep
                formData={{
                  bankName: formData.bankName,
                  accountHolder: formData.accountHolder,
                  accountNumber: formData.accountNumber,
                  taxEmail: formData.taxEmail,
                  businessRegistration: formData.businessRegistrationNumber,
                }}
                onChange={handleChange}
                onSubmit={handleSettlementInfoSubmit}
              />
            </div>
          </div>
        )
      case "complete":
        return <SignupCompleteStep isOwner={true} email={formData.email} password={formData.password} />
    }
  }

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 h-[52px] flex items-center border-b border-gray-100 bg-white max-w-[430px] mx-auto">
        <button onClick={handleBackClick} className="p-3 text-gray-800">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </header>

      {/* Content */}
      <main ref={mainRef} className="flex-1 overflow-y-auto h-[calc(100vh-52px)] pt-[52px] pb-[80px] px-5">
        <div className="py-6">{renderStep()}</div>
      </main>

      {/* Bottom Button */}
      {currentStep !== "complete" && (
        <div className="fixed bottom-0 left-0 right-0 px-5 py-4 bg-white border-t border-gray-100 max-w-[430px] mx-auto">
          <Button
            onClick={handleNextClick}
            disabled={
              currentStep === "email"
                ? !isEmailVerified || !formData.name || !isEmailValid
                : currentStep === "password"
                  ? !isPasswordValid || !doPasswordsMatch
                  : currentStep === "phone"
                    ? !formData.phone
                    : currentStep === "store"
                      ? !formData.storeName || !formData.storeAddress || !formData.storePhoto
                      : !formData.bankName || !formData.accountHolder || !formData.accountNumber
            }
          >
            {currentStep === "settlement" ? "가입 완료" : "다음"}
          </Button>
        </div>
      )}
    </div>
  )
}

