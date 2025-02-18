import type { OnboardingSlide } from "../types/onboarding"

const slides: OnboardingSlide[] = [
  {
    id: 1,
    title: "맛있는 빵, 더 저렴하게!",
    description: "마감할인으로 맛있는 빵을 할인된 가격으로 만나보세요",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/onboarding1-akRtqaCyuZmkqlkuFDDptrU7ychTQb.png",
  },
  {
    id: 2,
    title: "매장 재고, 더 효율적으로!",
    description: "매장의 남은 재고를 손쉽게 관리하고 손실을 줄이세요",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/onboarding2-62Y1Vr6WJDUw5lFg1CBQpFMv1jzt8M.png",
  },
  {
    id: 3,
    title: "음식물 쓰레기 줄이기!",
    description: "빵과와 함께 음식물 쓰레기를 줄이고 환경을 보호하세요",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/onboarding3-kbFkvKfQcMTpFzGakLtLgh6SZSk7YI.png",
  },
  {
    id: 4,
    title: "시작은 간편하게!",
    description: "간편 회원가입 또는 카카오로 빠르게 시작하세요",
    imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/onboarding4-llGpsLEOVDxtCVpcZhlPx1b3gb0xsS.png",
  },
]

export const getOnboardingSlides = async (): Promise<OnboardingSlide[]> => {
  // Simulating API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(slides), 500)
  })
}

