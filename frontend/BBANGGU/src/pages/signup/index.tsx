import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { SignupLayout } from "../../components/signup/SignupLayout"
import { Button } from "../../components/signup/Button"
import { UserTypeStep } from "./steps/UserTypeStep"


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
