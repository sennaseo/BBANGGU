import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { StockTop3Api } from '../../../api/owner/report/StockTop3Api';

type Period = 'day' | 'week' | 'month' | 'year';

interface TopProduct {
  name: string;
  count: number;
}

interface TopSectionProps {
  storeName: string;
}

export function TopSection({ storeName }: TopSectionProps) {
  const [period, setPeriod] = useState<Period>('day');
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [totalInventory, setTotalInventory] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const { userInfo } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchTop3 = async () => {
      if (!userInfo?.bakeryId) {
        setError('베이커리 정보가 없습니다.');
        setTopProducts([]);
        setTotalInventory(0);
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        const response = await StockTop3Api.getTop3Stocks(userInfo.bakeryId, period);

        // undefined 체크를 먼저 수행
        if (!response?.data?.top3) {
          setTopProducts([]);
          setTotalInventory(0);
          return;
        }
        
        // 데이터 구조에 맞게 매핑
        const products = response.data.top3.map(([name, count]) => ({
          name: name as string,
          count: count as number
        }));
        
        setTopProducts(products);
        setTotalInventory(response.data.total || 0);
        
      } catch (err: any) {
        console.error('Top3 API 에러:', err);
        setError(err.message || '데이터를 불러오는데 실패했습니다.');
        setTopProducts([]);
        setTotalInventory(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTop3();
  }, [period, userInfo?.bakeryId]);

  return (
    <div className="space-y-6">
      {/* Title centered at the very top */}
      <h1 className="text-2xl font-bold text-center mb-8">재고 관리 리포트</h1>

      {/* Store info and image */}
      <div className="relative mb-4">
        <p className="text-lg font-bold">
          <span className="text-[#FF9F43] text-2xl">{storeName}</span> 사장님,
        </p>
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%B9%B5%EC%9D%B4%EB%AA%A8%ED%8B%B0%EC%BD%98-zp9pLX4YYD0Tk3YrNXNGuxk7vxT9g8.png"
          alt="Bread icon"
          className="absolute -top-10 -right-2 w-32 h-31"
        />
      </div>

      {/* 섹션 제목과 드롭다운을 포함하는 컨테이너 */}
      <div className="relative mb-4 pt-2">
        <h2 className="font-bold text-xl text-center">재고 현황 요약</h2>
        <select 
          value={period} 
          onChange={(e) => setPeriod(e.target.value as Period)}
          className="absolute right-5 top-[60%] -translate-y-1/2 px-3 py-1 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 focus:outline-none focus:border-orange-400 w-20"
        >
          <option value="day">일간</option>
          <option value="week">주간</option>
          <option value="month">월간</option>
          <option value="year">연간</option>
        </select>
      </div>

      {/* TOP 3와 총 재고 그리드 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="font-bold mb-4 text-center">재고 빵 TOP 3</h3>
          <div className="space-y-2">
            {loading ? (
              <p>로딩 중...</p>
            ) : error ? (
              <div className="text-center py-4">
                <p className="text-gray-500">{error}</p>
              </div>
            ) : topProducts && topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-2">
                  <span className="flex-shrink-0">
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                  </span>
                  <span className="flex-1">{product.name}</span>
                  <span className="text-gray-600">{product.count}개</span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-2">
                {period === 'day' ? (
                  <p>사장님, 오늘의 재고를 등록해주세요!</p>
                ) : (
                  <p>해당 기간의 재고 데이터가 없습니다.</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="font-bold mb-4 text-center">총 재고</h3>
          <div className="flex flex-col items-center gap-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%20155-FUdAq2Z1zrdQGEKDGjMbTsmfY7bgqT.png"
              alt="Bread icon"
              className="w-12 h-12"
            />
            <span className="text-xl font-bold">{totalInventory}개</span>
          </div>
        </div>
      </div>
    </div>
  );
}
  
  