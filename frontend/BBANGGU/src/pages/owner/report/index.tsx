"use client"

import BottomNavigation from "../../../components/owner/navigations/BottomNavigations/BottomNavigation"
import { TopSection } from "../../../components/owner/report/TopSection"
import { InventoryCharts } from "../../../components/owner/report/InventoryCharts"
import { InventoryPrediction } from "../../../components/owner/report/InventoryPrediction"
import { InventoryAnalysis } from "../../../components/owner/report/InventoryAnalysis"

export default function ReportPage() {
  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-white pb-20">
      <main className="px-5 py-6">
        <TopSection
          storeName="김싸피"
          topProducts={[
            { name: "크로와상", count: 14 },
            { name: "단팥빵", count: 9 },
            { name: "바게트", count: 5 },
          ]}
          totalInventory={28}
        />
        <InventoryCharts />
        <InventoryPrediction
          date="2025-01-24"
          predictions={[
            { name: "크로와상", count: 7 },
            { name: "단팥빵", count: 12 },
            { name: "크림빵", count: 8 },
            { name: "커피빵", count: 5 },
            { name: "베이글", count: 2 },
          ]}
        />
        <InventoryAnalysis
          insights={[
            "단팥빵 재고 비율 24%, 현재 재고 9개\n→ 예측 재고 7개로 감소 예상, 추가 확보 필요",
            "크로와상 예상 재고 7개로 감소 예상,\n빠른 소진 대비 10% 추가 생산 필요",
            "주말 대비 전체 재고 20% 추가 확보 권장\n(현재 28개 → 34개 이상 유지 필요)",
          ]}
        />
      </main>
      <BottomNavigation />
    </div>
  )
}

