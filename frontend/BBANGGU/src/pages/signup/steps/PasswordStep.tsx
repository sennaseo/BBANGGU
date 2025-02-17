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
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const validatePassword = (password: string) => {
    if (password.length < 10) return '비밀번호는 10자리 이상이어야 합니다.'
    if (!/[a-zA-Z]/.test(password)) return '영문을 포함해야 합니다.'
    if (!/[!@#$%^&*]/.test(password)) return '특수문자(!@#$%^&*)를 포함해야 합니다.'
    return ''
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e)
    const error = validatePassword(e.target.value)
    setPasswordError(error)

    // 비밀번호와 확인 비밀번호 일치 여부 검사
    if (formData.confirmPassword && e.target.value !== formData.confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.')
    } else {
      setConfirmPasswordError('')
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e)
    if (formData.password !== e.target.value) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.')
    } else {
      setConfirmPasswordError('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <InputField
          label="비밀번호 입력"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handlePasswordChange}
          placeholder="비밀번호를 입력해주세요"
          className={passwordError ? 'border-[#FF9F43]' : ''}
          actionButton={
            <button type="button" onClick={togglePasswordVisibility} className="p-2 text-gray-500">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
        />
        {passwordError && <p className="text-sm text-[#FF9F43]">{passwordError}</p>}
      </div>

      <div className="space-y-2">
        <InputField
          label="비밀번호 확인"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={formData.confirmPassword}
        onChange={handleConfirmPasswordChange}
        placeholder="비밀번호를 한번 더 입력해주세요"
        className={confirmPasswordError ? 'border-[#FF9F43]' : ''}
        actionButton={
          <button type="button" onClick={toggleConfirmPasswordVisibility} className="p-2 text-gray-500">
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          }
        />
        {confirmPasswordError && <p className="text-sm text-[#FF9F43]">{confirmPasswordError}</p>}
      </div>
    </div>
  )
}

