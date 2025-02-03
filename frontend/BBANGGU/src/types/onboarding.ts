export interface OnboardingSlide {
    id: number
    title: string
    description: string
    imageUrl: string
  }
  
  export interface OnboardingState {
    currentSlide: number
    isLastSlide: boolean
  }
  
  