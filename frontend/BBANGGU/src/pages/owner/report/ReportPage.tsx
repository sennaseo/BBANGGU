"use client"

import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import BottomNavigation from "../../../components/owner/navigations/BottomNavigations/BottomNavigation"
import { TopSection } from "../../../components/owner/report/TopSection"
import { InventoryCharts } from "../../../components/owner/report/InventoryCharts"
import { InventoryRecord } from "../../../components/owner/report/InventoryRecord"
import { InventoryAnalysis } from "../../../components/owner/report/InventoryAnalysis"

export default function ReportPage() {
  const { userInfo } = useSelector((state: RootState) => state.user);

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-white pb-20">
      <main className="px-5 py-6">
        <TopSection storeName={userInfo?.name || '가게 이름'} />
        <InventoryCharts />
        <InventoryRecord />
        <InventoryAnalysis />
      </main>
      <BottomNavigation />
    </div>
  )
}

