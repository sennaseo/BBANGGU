import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Header } from "../../../components/user/payment/Header"
import { RandomMenu } from "../../../components/user/payment/RandomMenu"
import { PickupTime } from "../../../components/user/payment/PickupTime"
import { PaymentMethod } from "../../../components/user/payment/PaymentMethod"
import { PaymentComplete } from "../../../components/user/payment/PaymentComplete"
import { PackageSelect } from "../../../components/user/payment/PackageSelect"
import { fetchBakeryDetail } from "../../../services/user/detail/bakeryDetailService"
import { BakeryInfo } from '../../../store/slices/bakerySlice'

export function UserPayment() {
  const { bakeryId } = useParams<{ bakeryId: string }>()
  const [step, setStep] = useState(0)
  const [bakeryData, setBakeryData] = useState<BakeryInfo | null>(null)
  const [orderInfo, setOrderInfo] = useState({
    quantity: 1,
    totalPrice: 0,
    reservationId: 0
  })
  const navigate = useNavigate()

  // 컴포넌트 마운트 시 스크롤을 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadBakeryDetail = async () => {
      try {
        const data = await fetchBakeryDetail(Number(bakeryId))
        // 데이터 변환
        const transformedData: BakeryInfo = {
          ...data,
          price: data.price || 0  // null인 경우 0으로 설정
        }
        setBakeryData(transformedData)
      } catch (err) {
        console.error("베이커리 정보 로드 실패:", err)
      }
    }

    loadBakeryDetail()
  }, [bakeryId])

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    } else {   
      navigate(-1)
    }
  }  

  const handleNext = () => {
    setStep(step + 1)  // 다음 단계로 이동
  }

  const handleComplete = () => {
    navigate("/user") // 홈으로 이동
  }

  const handlePackageSelect = (quantity: number, totalPrice: number, reservationId: number) => {
    setOrderInfo({ quantity, totalPrice, reservationId })
    setStep(step + 1)
  }

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-white">
      <Header onBack={handleBack} />
      {step === 0 && <RandomMenu onConfirm={handleNext} />}
      {step === 1 && <PickupTime onConfirm={handleNext} />}
      {step === 2 && (
        <PackageSelect 
          bakeryData={bakeryData} 
          onConfirm={handlePackageSelect}
        />
      )}
      {step === 3 && (
        <PaymentMethod 
          totalPrice={orderInfo.totalPrice}
        />
      )}
      {step === 4 && <PaymentComplete onConfirm={handleComplete} />}
    </div>
  )
}

