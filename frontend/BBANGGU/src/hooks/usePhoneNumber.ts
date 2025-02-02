import { useState } from 'react';

export function usePhoneNumber(initialValue: string = '') {
  const [phoneNumber, setPhoneNumber] = useState(initialValue);

  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');
    
    // 길이에 따라 포맷팅
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    if (formatted.length <= 13) { // 010-0000-0000 형식의 최대 길이
      setPhoneNumber(formatted);
    }
  };

  return {
    phoneNumber,
    handleChange,
    setPhoneNumber
  };
}