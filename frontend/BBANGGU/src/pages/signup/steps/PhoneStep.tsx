import { Button } from "../../../components/signup/Button"
import { InputField } from "../../../components/signup/InputField"
import type React from "react"

interface PhoneStepProps {
  formData: {
    phone: string
    verificationCode: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPhoneVerification: () => void
  onVerificationSubmit: () => void
  isVerificationSent: boolean
  isVerified: boolean
}

export function PhoneStep({
  formData,
  onChange,
  onPhoneVerification,
  onVerificationSubmit,
  isVerificationSent,
  isVerified,
}: PhoneStepProps) {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    onChange({
      ...e,
      target: {
        ...e.target,
        name: e.target.name,
        value: value,
      },
    })
  }

  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 5)
    onChange({
      ...e,
      target: {
        ...e.target,
        name: "phoneVerificationCode",
        value: value,
      },
    })
  }

  const formatPhoneNumber = (value: string) => {
    if (value.length <= 3) return value
    if (value.length <= 7) return `${value.slice(0, 3)}-${value.slice(3)}`
    return `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`
  }

  const isPhoneValid = formData.phone.replace(/[^0-9]/g, "").length >= 10

  return (
    <div className="space-y-4">
      <InputField
        label="휴대전화 번호"
        name="phone"
        type="tel"
        value={formatPhoneNumber(formData.phone)}
        onChange={handlePhoneChange}
        placeholder="010-1234-5678"
        actionButton={
          <Button
            variant="secondary"
            fullWidth={false}
            className="px-4 h-[32px] text-sm rounded-lg"
            onClick={onPhoneVerification}
            disabled={!isPhoneValid}
          >
            인증요청
          </Button>
        }
      />

      {isVerificationSent && (
        <div className="space-y-2">
          <InputField
            label="인증번호"
            name="phoneVerificationCode"
            value={formData.verificationCode}
            onChange={handleVerificationCodeChange}
            placeholder="13579"
            actionButton={
              <Button
                variant="secondary"
                fullWidth={false}
                className="px-4 h-[32px] text-sm rounded-lg"
                onClick={onVerificationSubmit}
                disabled={formData.verificationCode.length !== 5}
              >
                확인
              </Button>
            }
          />
          {isVerified && <p className="text-sm text-gray-600">인증되었습니다!</p>}
        </div>
      )}
    </div>
  )
}

