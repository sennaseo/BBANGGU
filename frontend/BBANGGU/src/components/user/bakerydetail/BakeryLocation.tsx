import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { BakeryType } from "../../../types/bakery";
import { MapView } from "../map/MapView"; // MapView.tsx 사용

interface BakeryLocationProps {
  location: BakeryType;
}

export default function BakeryLocation({ location }: BakeryLocationProps) {
  const [isMapVisible, setIsMapVisible] = useState(false);

  return (
    <div className="bg-[#F2F2F2] ">
      {/* 위치 안내 버튼 */}
      <button
        className="flex w-full justify-between items-center py-[20px] px-[20px] gap-3"
        onClick={() => setIsMapVisible(!isMapVisible)}
      >
        <div className="flex gap-3 items-center">
          <h2 className="whitespace-nowrap text-[14px] font-medium text-[#333333]">위치안내</h2>
          <p className="text-[12px] font-light text-[#BDBDBD]">{location.addressRoad}</p>
          <p className="text-[12px] font-light text-[#BDBDBD]">({location.addressDetail})</p>
        </div> 
        {isMapVisible ? (
          <ChevronUp className="h-6 w-6 text-[#A2A2A2]" />
        ) : (
          <ChevronDown className="h-6 w-6 text-[#A2A2A2]" />
        )}
      </button>

      {/* ✅ 지도 컨테이너 (하단 여백 완전 제거) */}
      {isMapVisible && (
        <div
          className="w-full h-[300px] rounded-lg border border-gray-300 overflow-hidden"
          style={{ marginBottom: "0px !important", paddingBottom: "0px !important" }}
        >
          <MapView
            bakeries={[]} // 필요하면 베이커리 목록 전달
            onMarkerClick={() => { }} // 클릭 이벤트 처리
            userAddress={location.addressRoad} // 가게 주소 전달
          />
        </div>
      )}
    </div>
  );
}
