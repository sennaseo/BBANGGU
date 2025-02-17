import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { StockDateApi } from "../../../api/owner/report/StockDateApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

interface StockRecord {
  breadName: string;
  quantity: number;
}

export function InventoryRecord() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [records, setRecords] = useState<StockRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { userInfo } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!userInfo?.bakeryId) return;

      setLoading(true);
      try {
        const dateString = selectedDate.toISOString().split('T')[0];
        const response = await StockDateApi.getStocksByDate(userInfo.bakeryId, dateString);
        
        const formattedRecords = response.data.map(item => ({
          breadName: item.breadName,
          quantity: item.quantity
        }));
        
        setRecords(formattedRecords);
        setError(null);
      } catch (err: any) {
        console.error('재고 기록 조회 실패:', err);
        setError('재고 기록을 불러오는데 실패했습니다.');
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [selectedDate, userInfo?.bakeryId]);

  return (
    <div className="mt-8">
      <h3 className="text-center font-bold text-xl mb-4">재고 기록</h3>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-1 bg-gray-100 py-1 px-3 rounded-lg">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => date && setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              className="bg-transparent text-center text-sm focus:outline-none w-24"
            />
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">데이터를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-gray-500">{error}</p>
          </div>
        ) : records.length > 0 ? (
          <div>
            <div className="flex justify-between mb-4 px-4">
              <span className="text-gray-500 text-sm">상품명</span>
              <span className="text-gray-500 text-sm">예측 재고</span>
            </div>
            <div className="space-y-3">
              {records.map((record, index) => (
                <div 
                  key={index} 
                  className="flex justify-between px-4 py-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-800">{record.breadName}</span>
                  <span className="text-gray-800">{record.quantity}개</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">해당 날짜의 재고 기록이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// DatePicker 커스텀 스타일 추가
const styles = `
  .react-datepicker-wrapper {
    width: auto;
  }
  .react-datepicker__input-container input {
    width: 100px;
  }
`;

// 스타일을 head에 추가
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
} 