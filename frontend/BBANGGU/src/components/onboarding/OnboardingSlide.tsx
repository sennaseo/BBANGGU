import type { OnboardingSlide as SlideType } from "../../types/onboarding"

interface OnboardingSlideProps {
  slide: SlideType
  isActive: boolean
}

export const OnboardingSlide = ({ slide }: OnboardingSlideProps) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-6 pb-32 select-none">
      <div className="relative w-48 h-48 mb-12">
        <img
          src={slide.imageUrl || "/placeholder.svg"}
          alt={slide.title}
          className="w-full h-full object-contain touch-none"
          draggable={false}
        />
      </div>
      <h2 className="text-2xl font-bold mb-3 text-center whitespace-nowrap">{slide.title}</h2>
      <p className="text-gray-600 text-center text-base whitespace-nowrap">{slide.description}</p>
    </div>
  )
}

