import { CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../../store"
import { StockAnalysisApi } from "../../../api/owner/report/StockAnalysisApi"

export function InventoryAnalysis() {
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { userInfo } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!userInfo?.bakeryId) return;
      
      setLoading(true);
      try {
        const response = await StockAnalysisApi.getAnalysis(userInfo.bakeryId);
        // GPT 응답을 줄바꿈을 기준으로 배열로 변환
        const analysisArray = response.data.split('\n').filter(item => item.trim());
        setInsights(analysisArray);
        setError(null);
      } catch (err: any) {
        console.error('분석 데이터 조회 실패:', err);
        setError('분석 데이터를 불러오는데 실패했습니다.');
        setInsights([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [userInfo?.bakeryId]);

  return (
    <div className="mt-8">
      <h3 className="text-center font-bold text-xl mb-4">분석 결과 및 추천 사항</h3>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">분석 중입니다...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-gray-500">{error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {insights.map((insight, index) => (
              <div key={index} className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#FF9F43] flex-shrink-0 mt-1" />
                <p className="text-sm text-gray-600 whitespace-pre-line">{insight}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

