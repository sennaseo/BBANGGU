import { CheckCircle2 } from "lucide-react"

interface InventoryAnalysisProps {
  insights: string[]
}

export function InventoryAnalysis({ insights }: InventoryAnalysisProps) {
  return (
    <div className="mt-8">
      <h3 className="text-center font-bold text-xl mb-4">분석 결과 및 추천 사항</h3>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <div className="space-y-6">
          {insights.map((insight, index) => (
            <div key={index} className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#FF9F43] flex-shrink-0 mt-1" />
              <p className="text-sm text-gray-600 whitespace-pre-line">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

