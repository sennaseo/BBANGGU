"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

interface InventoryPredictionProps {
  date: string
  predictions: Array<{
    name: string
    count: number
  }>
}

export function InventoryPrediction({ date: initialDate, predictions }: InventoryPredictionProps) {
  const [date, setDate] = useState<Date>(new Date(initialDate))
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate)
      setIsCalendarOpen(false)
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-center font-bold text-xl mb-4">재고 예측</h2>

      <div className="bg-white rounded-2xl shadow-sm">
        {/* Date Selector */}
        <div className="relative">
          <div className="flex justify-center items-center py-3">
            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm"
            >
              <span>{format(date, "yyyy-MM-dd", { locale: ko })}</span>
              <Calendar className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Calendar Popup */}
          {isCalendarOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 z-10 bg-white rounded-lg shadow-lg p-2 border border-gray-200">
              <DayPicker
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                locale={ko}
                styles={{
                  caption: { color: "black" },
                  nav_button_previous: { color: "#FF9F43" },
                  nav_button_next: { color: "#FF9F43" },
                }}
                modifiers={{
                  selected: date,
                }}
                modifiersStyles={{
                  selected: {
                    color: "#FF9F43",
                    fontWeight: "bold",
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* Table Headers */}
        <div className="grid grid-cols-2 gap-4 px-6 py-3 bg-gray-50">
          <div className="text-gray-600 text-center">상품명</div>
          <div className="text-gray-600 text-center">예측 재고</div>
        </div>

        {/* Table Content */}
        <div className="divide-y divide-gray-100">
          {predictions.map((item) => (
            <div key={item.name} className="grid grid-cols-2 gap-4 px-6 py-4">
              <div className="text-center">{item.name}</div>
              <div className="text-center">{item.count}개</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

