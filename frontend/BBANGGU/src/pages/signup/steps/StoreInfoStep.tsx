import { useState, useCallback, useEffect } from "react"
import { InputField } from "../../../components/signup/InputField"

interface StoreInfoStepProps {
  formData: {
    storeName: string
    storeDescription: string
    storePhone: string
    storeAddress: string
    storeAddressDetail: string
    storePhoto: string
    businessRegistrationNumber: string
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

declare global {
  interface Window {
    daum: {
      Postcode: new (options: { oncomplete: (data: PostcodeData) => void }) => { open: () => void };
    };
  }
}

interface PostcodeData {
  roadAddress: string;
  bname: string;
  buildingName: string;
  apartment: string;
}

export function StoreInfoStep({ formData, onChange }: StoreInfoStepProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isPostcodeLoaded, setIsPostcodeLoaded] = useState(false)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
    script.async = true
    script.onload = () => setIsPostcodeLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        onChange({
          ...e,
          target: {
            name: "storePhoto",
            value: reader.result as string,
          },
        } as React.ChangeEvent<HTMLInputElement>)
      }
      reader.readAsDataURL(file)
    }
  }

  const openAddressSearch = useCallback(() => {
    if (!isPostcodeLoaded) {
      console.error("Daum Postcode script is not loaded yet")
      return
    }

    new window.daum.Postcode({
      oncomplete: (data: PostcodeData) => {
        const roadAddr = data.roadAddress
        let extraRoadAddr = ""

        if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
          extraRoadAddr += data.bname
        }
        if (data.buildingName !== "" && data.apartment === "Y") {
          extraRoadAddr += extraRoadAddr !== "" ? ", " + data.buildingName : data.buildingName
        }
        if (extraRoadAddr !== "") {
          extraRoadAddr = " (" + extraRoadAddr + ")"
        }

        onChange({
          target: {
            name: "storeAddress",
            value: roadAddr + extraRoadAddr,
          },
        } as React.ChangeEvent<HTMLInputElement>)
      },
    }).open()
  }, [onChange, isPostcodeLoaded])

  return (
    <div className="space-y-6">
      <InputField
        label="가게 이름"
        name="storeName"
        value={formData.storeName}
        onChange={onChange}
        placeholder="가게 이름을 입력해주세요"
      />

      <InputField
        label="가게 설명"
        name="storeDescription"
        value={formData.storeDescription}
        onChange={onChange}
        placeholder="가게를 소개해주세요"
      />

      <InputField
        label="사업자 등록 번호"
        name="businessRegistrationNumber"
        value={formData.businessRegistrationNumber}
        onChange={onChange}
        placeholder="사업자 등록 번호를 입력해주세요"
      />

      <InputField
        label="가게 전화번호"
        name="storePhone"
        value={formData.storePhone}
        onChange={onChange}
        placeholder="가게 전화번호를 입력해주세요"
      />

      <div className="space-y-2">
        <InputField
          label="가게 주소"
          name="storeAddress"
          value={formData.storeAddress}
          onChange={onChange}
          placeholder="클릭하여 주소 검색"
          className="cursor-pointer"
          onClick={openAddressSearch}
          readOnly
        />
        <InputField
          label=""
          name="storeAddressDetail"
          value={formData.storeAddressDetail}
          onChange={onChange}
          placeholder="세부 주소 입력"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-[15px] font-medium">가게 사진</label>
        <div
          className="relative aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 overflow-hidden cursor-pointer"
          onClick={() => document.getElementById("store-photo")?.click()}
        >
          {imagePreview ? (
            <img src={imagePreview || "/placeholder.svg"} alt="Store preview" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">터치하여 업로드</div>
          )}
          <input type="file" id="store-photo" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </div>
      </div>
    </div>
  )
}

