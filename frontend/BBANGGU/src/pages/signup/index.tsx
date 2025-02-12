import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { SignupLayout } from "../../components/signup/SignupLayout"
import { Button } from "../../components/signup/Button"
import { UserTypeStep } from "./steps/UserTypeStep"
import { AuthApi } from "../../api/common/signup/AuthApi"

type UserType = "customer" | "owner" | null;

export default function SignupPage() {
  const [selectedType, setSelectedType] = useState<UserType>(null)
  const navigate = useNavigate()

  const handleUserTypeSelect = (type: UserType) => {
    setSelectedType(type)
  }

  const handleSubmit = () => {
    if (selectedType === "customer") {
      navigate("/signup/customer", { 
        state: { role: 'USER' } 
      })
    } else if (selectedType === "owner") {
      navigate("/signup/owner", { 
        state: { role: 'OWNER' } 
      })
    }
  }

  // 토큰 재발급이 필요한 경우 사용할 함수
  const refreshAccessToken = async () => {
    try {
      await AuthApi.refreshToken();
    } catch (error: any) {
      if (error.code === 4001) {
        alert('다시 로그인해주세요.');
        // 로그인 페이지로 리다이렉트
        navigate('/login');
      } else if (error.code === 4008) {
        alert('보안상의 이유로 로그아웃됩니다.');
        // 로그아웃 처리
        navigate('/login');
      } else {
        alert(error.message || '토큰 갱신에 실패했습니다.');
      }
    }
  }

  return (
    <SignupLayout
      title="회원가입"
      description="빵구, 어떻게 즐기실래요?"
      bottomButton={
        <Button onClick={handleSubmit} disabled={!selectedType}>
          다음
        </Button>
      }
    >
      <UserTypeStep selectedType={selectedType} onSelect={handleUserTypeSelect} />
    </SignupLayout>
  )
}
