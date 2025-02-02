import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { InputField } from "../../../components/signup/InputField"

interface PasswordStepProps {
  formData: {
    password: string
    confirmPassword: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function PasswordStep({ formData, onChange }: PasswordStepProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const isPasswordValid = formData.password.length >= 8
  const doPasswordsMatch = formData.password === formData.confirmPassword

  return (
    <div className="space-y-6">
      <InputField
        label="비밀번호 입력"
        name="password"
        type={showPassword ? "text" : "password"}
        value={formData.password}
        onChange={onChange}
        placeholder="SSAFY123!"
        actionButton={
          <button type="button" onClick={togglePasswordVisibility} className="p-2 text-gray-500">
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        }
      />
      <InputField
        label="비밀번호 입력"
        name="confirmPassword"
        type={showConfirmPassword ? "text" : "password"}
        value={formData.confirmPassword}
        onChange={onChange}
        placeholder="비밀번호를 한번 더 입력해주세요"
        actionButton={
          <button type="button" onClick={toggleConfirmPasswordVisibility} className="p-2 text-gray-500">
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        }
      />
    </div>
  )
}

