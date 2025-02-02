import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { SignupLayout } from "../../components/signup/SignupLayout"
import { Button } from "../../components/signup/Button"
import { UserTypeStep } from "./steps/UserTypeStep"

export default function SignupPage() {
  const [selectedType, setSelectedType] = useState<"customer" | "owner" | null>(null)
  const navigate = useNavigate()

  const handleUserTypeSelect = (type: "customer" | "owner") => {
    setSelectedType(type)
  }

  const handleSubmit = () => {
    if (selectedType === "customer") {
      navigate("/signup/customer")
    } else if (selectedType === "owner") {
      navigate("/signup/owner")
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

