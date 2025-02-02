interface SlideIndicatorProps {
  total: number
  current: number
  onSelect: (index: number) => void
}

export const SlideIndicator = ({ total, current, onSelect }: SlideIndicatorProps) => {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`w-2 h-2 rounded-full transition-all ${index === current ? "bg-gray-800 w-4" : "bg-gray-300"}`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  )
}

