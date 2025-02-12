import { InputField } from "../../../components/signup/InputField"
import type React from "react"

interface PhoneStepProps {
  formData: {
    phone: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function PhoneStep({
  formData,
  onChange,
}: PhoneStepProps) {
  const formatPhoneNumber = (input: string) => {
    // 숫자만 추출
    const numbers = input.replace(/[^0-9]/g, '');
    
    // 11자리로 제한
    const limitedNumbers = numbers.slice(0, 11);
    
    // 형식에 맞게 하이픈 추가
    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    }
    if (limitedNumbers.length <= 7) {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
    }
    return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 여기서 로그 추가
    console.log('PhoneStep - 입력된 값:', e.target.value);
    
    const formattedNumber = formatPhoneNumber(e.target.value);
    // 형식화된 값 로그
    console.log('PhoneStep - 형식화된 값:', formattedNumber);
    
    onChange({
      ...e,
      target: {
        ...e.target,
        name: 'phone',
        value: formattedNumber,
      },
    });
  };

  return (
    <div className="space-y-4">
      <InputField
        label="휴대전화 번호"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={handlePhoneChange}
        placeholder="010-1234-5678"
        maxLength={13}
      />
    </div>
  );
}

