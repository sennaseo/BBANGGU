import type React from "react"
import { InputField } from "../../../components/signup/InputField"
import { Button } from "../../../components/signup/Button"

interface NameEmailStepProps {
  formData: {
    name: string
    email: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onEmailVerification: () => void
  onSubmit: () => void
}

export function NameEmailStep({ formData, onChange, onEmailVerification, onSubmit }: NameEmailStepProps) {
  const isEmailValid = formData.email.includes("@") && formData.email.includes(".")

  return (
    <div className="space-y-6">
      <InputField
        label="이름"
        name="name"
        value={formData.name}
        onChange={onChange}
        placeholder="이름을 입력해주세요"
      />
      <InputField
        label="이메일"
        name="email"
        type="email"
        value={formData.email}
        onChange={onChange}
        placeholder="이메일을 입력해주세요"
        actionButton={
          <Button
            variant="secondary"
            fullWidth={false}
            className="px-3 rounded-lg"
            disabled={!isEmailValid}
            onClick={onEmailVerification}
          >
            인증요청
          </Button>
        }
      />
    </div>
  )
}

