import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Header } from "../../../components/user/payment/Header"
import { RandomMenu } from "../../../components/user/payment/RandomMenu"
import { PickupTime } from "../../../components/user/payment/PickupTime"
import { PaymentMethod } from "../../../components/user/payment/PaymentMethod"
import { PaymentComplete } from "../../../components/user/payment/PaymentComplete"

export function UserPayment() {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    } else {
      navigate(-1) // Go back to the previous page
    }
  }

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleComplete = () => {
    navigate("/") // Navigate to home page
  }

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-white">
      <Header onBack={handleBack} />
      {step === 0 && <RandomMenu onConfirm={handleNext} />}
      {step === 1 && <PickupTime onConfirm={handleNext} />}
      {step === 2 && <PaymentMethod onConfirm={handleNext} />}
      {step === 3 && <PaymentComplete onConfirm={handleComplete} />}
    </div>
  )
}

