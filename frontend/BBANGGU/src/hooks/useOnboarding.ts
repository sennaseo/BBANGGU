import { useState, useCallback } from "react"
import type { OnboardingState } from "../types/onboarding"

export const useOnboarding = (totalSlides: number) => {
  const [state, setState] = useState<OnboardingState>({
    currentSlide: 0,
    isLastSlide: false,
  })

  const goToNextSlide = useCallback(() => {
    setState((prev) => {
      const nextSlide = prev.currentSlide + 1
      return {
        currentSlide: nextSlide,
        isLastSlide: nextSlide === totalSlides - 1,
      }
    })
  }, [totalSlides])

  const goToPrevSlide = useCallback(() => {
    setState((prev) => ({
      currentSlide: Math.max(0, prev.currentSlide - 1),
      isLastSlide: false,
    }))
  }, [])

  const goToSlide = useCallback(
    (index: number) => {
      setState({
        currentSlide: index,
        isLastSlide: index === totalSlides - 1,
      })
    },
    [totalSlides],
  )

  return {
    ...state,
    goToNextSlide,
    goToPrevSlide,
    goToSlide,
  }
}

