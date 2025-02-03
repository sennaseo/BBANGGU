import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import type { OnboardingSlide as SlideType } from "../../types/onboarding"
import { getOnboardingSlides } from "../../services/onboardingService"
import { useOnboarding } from "../../hooks/useOnboarding"
import { OnboardingSlide } from "../../components/onboarding/OnboardingSlide"
import { SlideIndicator } from "../../components/onboarding/SlideIndicator"

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [slides, setSlides] = useState<SlideType[]>([])
  const { currentSlide, isLastSlide, goToNextSlide, goToPrevSlide, goToSlide } = useOnboarding(slides.length)
  const touchStartRef = useRef(0)
  const slideRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadSlides = async () => {
      const data = await getOnboardingSlides()
      setSlides(data)
    }
    loadSlides()
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!slideRef.current) return

    const touchEnd = e.touches[0].clientX
    const diff = touchStartRef.current - touchEnd

    slideRef.current.style.transform = `translateX(calc(-${currentSlide * 100}% - ${diff}px))`
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!slideRef.current) return

    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStartRef.current - touchEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNextSlide()
      } else {
        goToPrevSlide()
      }
    }

    slideRef.current.style.transform = `translateX(-${currentSlide * 100}%)`
  }

  const handleButtonClick = () => {
    if (isLastSlide) {
      navigate("/login")
    } else {
      goToNextSlide()
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-white safe-area-inset">
      <div
        className="flex-1 relative overflow-hidden touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={slideRef}
          className="absolute inset-0 flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="flex-shrink-0 w-full h-full">
              <OnboardingSlide slide={slide} isActive={true} />
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 flex flex-col items-center px-6 pb-12 bg-white">
        <SlideIndicator total={slides.length} current={currentSlide} onSelect={goToSlide} />
        <button
          onClick={handleButtonClick}
          className="w-[500px] max-w-full mt-6 bg-[#FF9F43] text-white py-4 rounded-full font-medium text-lg active:opacity-90 touch-none"
          style={{
            WebkitTapHighlightColor: "transparent",
            marginBottom: "env(safe-area-inset-bottom, 0px)",
          }}
        >
          {isLastSlide ? "시작하기" : "다음"}
        </button>
      </div>
    </div>
  )
}

