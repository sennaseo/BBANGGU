import { useState } from "react"
import { InputField } from "../../../components/signup/InputField"

interface SettlementInfoStepProps {
  formData: {
    bankName: string
    accountHolder: string
    accountNumber: string
    taxEmail: string
    businessRegistration: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
}

export function SettlementInfoStep({ formData, onChange }: SettlementInfoStepProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
  
        // 🔹 `onChange`를 통해 File 객체를 전달하도록 수정
        onChange({
          ...e,
          target: {
            name: "businessLicenseFileUrl",
            value: reader.result as string, 
          },
        } as React.ChangeEvent<HTMLInputElement>);
      };
      reader.readAsDataURL(file);
    }
  };
  

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    onChange({
      ...e,
      target: {
        name: "accountNumber",
        value,
      },
    } as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <div className="space-y-6">
      <InputField
        label="거래은행"
        name="bankName"
        value={formData.bankName}
        onChange={onChange}
        placeholder="거래은행을 입력해주세요"
      />

      <InputField
        label="예금주명"
        name="accountHolder"
        value={formData.accountHolder}
        onChange={onChange}
        placeholder="예금주명을 입력해주세요"
      />

      <InputField
        label="사업자 계좌번호"
        name="accountNumber"
        value={formData.accountNumber}
        onChange={handleAccountNumberChange}
        placeholder="숫자만 입력"
      />

      <InputField
        label="세금계산서 발급용 이메일"
        name="taxEmail"
        type="email"
        value={formData.taxEmail}
        onChange={onChange}
        placeholder="세금계산서 발급용 이메일을 입력해주세요"
      />

      <div className="space-y-2">
        <label className="block text-[15px] font-medium">사업자등록증 사본</label>
        <div
          className="relative aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 overflow-hidden cursor-pointer"
          onClick={() => document.getElementById("business-registration")?.click()}
        >
          {imagePreview ? (
            <img
              src={imagePreview || "/placeholder.svg"}
              alt="Business registration preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">탭하여서 업로드</div>
          )}
          <input
            type="file"
            id="business-registration"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>
    </div>
  )
}

