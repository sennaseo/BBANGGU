import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { calculateImpact, getSaveReport } from "../../../../services/user/mypage/save-report/saveReportService"
import { EchoSave } from "../../../../store/slices/echosaveSlice"


export function UserSaveReport() {
  const navigate = useNavigate()
  const [saveReport, setSaveReport] = useState<EchoSave | null>(null);
  const [impact, setImpact] = useState<{ 
      reducedCo2e: number, 
      waterSaving: number, 
      reducedTravelDistance: number,
      foodWasteReduction: number,
      savedMoney: number 
    } | null>(null);

  useEffect(() => {
    const fetchSaveReport = async () => {
      try {
        const response = await getSaveReport();
        setSaveReport(response);
        const computedImpact = calculateImpact(response.savedMoney);
        setImpact(computedImpact);
      } catch (error) {
        console.error('절약 리포트 조회 실패:', error);
      }
    };

    fetchSaveReport();
  }, []);



  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-5 relative">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold absolute left-1/2 -translate-x-1/2">나의 절약 리포트</h1>
        <div className="w-6"></div>
      </div>

      {/* 총 절약 금액 */}
      <div className="bg-whtie text-center pt-5 mx-5">
        <div className="w-[110px] h-[110px] bg-[#FC973B] rounded-full mx-auto mb-4 flex items-center justify-center">
          <img src="/src/assets/pig.png" alt="절약 금액" className="w-13 h-13" />
        </div>
        <h2 className="text-[#333333] text-lg mb-2 font-bold">총 절약 금액</h2>
        <p className="text-[#FC973B] text-4xl font-bold">{saveReport?.savedMoney}원</p>
        <p className="text-[#333333] text-sm mt-2">제고 할인으로 현명하게 절약했어요!</p>
      </div>

      {/* 절약 상세 정보 */}
      <div className="px-10 pt-5 grid grid-cols-2 gap-4">
        <div className="bg-[#F9F9F9] rounded-xl shadow-md py-5 flex flex-col items-center justify-center">
          <div className="text-center mb-2">
            <img src="/src/assets/tree-fill.png" alt="탄소 배출 감소" className="w-12 h-12 mx-auto mb-2" />
            <h3 className="text-[16px] text-[#666666]">탄소 배출 감소</h3>
          </div>

          <p className="text-center font-bold text-xl text-[#333333]">{saveReport?.reducedCo2e}kg</p>
        </div>

        <div className="bg-[#F9F9F9] rounded-xl shadow-md flex flex-col items-center justify-center">
          <div className="text-center mb-2">
            <img src="/src/assets/mdi_bread.png" alt="음식물 낭비 감소" className="w-12 h-12 mx-auto mb-2" />
            <h3 className="text-[16px] text-[#666666]">음식물 낭비 감소</h3>
          </div>

          <p className="text-center font-bold text-xl text-[#333333]">{impact?.foodWasteReduction}L</p>
        </div>

        <div className="bg-[#F9F9F9] rounded-xl shadow-md py-5 flex flex-col items-center justify-center">
          <div className="text-center mb-2">
            <img src="/src/assets/fe_car.png" alt="주행거리 감소" className="w-12 h-12 mx-auto mb-2" />

            <h3 className="text-[16px] text-[#666666]">주행거리 감소</h3>
          </div>
          <p className="text-center font-bold text-xl text-[#333333]">{impact?.reducedTravelDistance}km</p>
        </div>

        <div className="bg-[#F9F9F9] rounded-xl shadow-md py-5 flex flex-col items-center justify-center">
          <div className="text-center mb-2">
            <img src="/src/assets/shower-fill.png" alt="샤워물 절약" className="w-12 h-12 mx-auto mb-2" />

            <h3 className="text-[16px] text-[#666666]">샤워물 절약</h3>
          </div>
          <p className="text-center font-bold text-xl text-[#333333]">{impact?.waterSaving}L</p>
        </div>

      </div>

      <p className="text-center text-sm text-[#666666] mt-5 px-5">
        지구를 위한 당신의 현명한 소비가<br />
        더 나은 미래를 만듭니다
      </p>

      {/* 빵꾸리미 둘러보기 버튼 */}
      <div className="p-5 flex justify-center">
        <button 
          onClick={() => navigate('/user')}
          className="px-10 bg-[#fc973b] text-white py-4 rounded-full font-semibold"
        >
          빵꾸러미 둘러보기
        </button>
      </div>
    </div>
  )
} 