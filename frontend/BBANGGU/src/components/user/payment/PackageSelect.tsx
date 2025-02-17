import { useState } from "react"
import PaymentButton from "./common/PaymentButton"
import { BakeryInfo } from '../../../store/slices/bakerySlice';
import { ReservationApi } from '../../../api/user/reservation/PaymentApi';

interface ExtendedBakeryInfo extends BakeryInfo {
  package: {
    data: Array<{
      name: string;
      price: number;
      quantity: number;
    }>;
  };
}

interface PackageSelectProps {
  onConfirm: (quantity: number, totalPrice: number, reservationId: number) => void;
  bakeryData: ExtendedBakeryInfo | null;
}

export function PackageSelect({ onConfirm, bakeryData }: PackageSelectProps) {
  const [quantity, setQuantity] = useState(1)
  
  if (!bakeryData || !bakeryData.package.data[0]) return null;
  
  const packageData = bakeryData.package.data[0];
  const totalPrice = packageData.price * quantity;

  const handleIncrement = () => {
    if (quantity < packageData.quantity) {  // 남은 수량보다 작을 때만 증가
      setQuantity(quantity + 1)
    }
  }

  const handleDecrement = () => {
    setQuantity(Math.max(1, quantity - 1))
  }

  const handleConfirm = async () => {
    try {
      if (!bakeryData) return;
      
      console.log('===== 구매하기 버튼 클릭 =====');
      console.log('가게 정보:', bakeryData);
      console.log('선택 수량:', quantity);
      
      // 예약 가능 여부 검증
      const response = await ReservationApi.checkReservation(bakeryData.bakeryId, quantity);
      console.log('예약 검증 성공:', response);
      
      // sessionStorage에 reservationId 저장
      sessionStorage.setItem('currentReservationId', response.data.reservationId.toString());
      console.log('===== sessionStorage에 reservationId 저장 =====', response.data.reservationId);
      
      // 검증 성공 시 reservationId와 함께 다음 단계로
      onConfirm(quantity, totalPrice, response.data.reservationId);
    } catch (error: any) {
      console.error('예약 검증 실패:', error);
      // 에러 메시지 표시
      alert(error.response?.data?.message || '예약 검증에 실패했습니다.');
    }
  };

  return (
    <div className="w-full max-w-[430px] mx-auto min-h-screen bg-white pb-20">
      <div className="flex-1 px-5">
        <h2 className="text-xl font-bold mb-6">수량선택</h2>
        
        {/* 빵꾸러미 카드 */}
        <div className="bg-white border border-[#F2F2F2] shadow-md rounded-xl p-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center bg-[#FFF5E9] rounded-xl w-[104px] h-[104px]">
              <img 
                src="/src/assets/images/bakery/빵꾸러미.png" 
                alt="빵꾸러미" 
                className="h-[80px]"
              />
            </div>
            <div>
              <h3 className="text-[18px] font-bold mb-2 text-[#333333]">{packageData.name}</h3>
              <div className="flex flex-col gap-2">
                <span className="text-[15px] text-[#A9A9A9]">남은 수량: <span className="font-bold">{packageData.quantity}개</span></span>
                <div className="flex items-center gap-1">
                  <span className="text-[18px] font-bold text-[#333333]">{packageData.price.toLocaleString()}원</span>
                  <span className="text-[14px] text-[#E1E1E1] line-through">{(packageData.price * 2).toLocaleString()}원</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 수량 선택 */}
        <div className="bg-white rounded-xl p-5 border border-[#F2F2F2] shadow-md">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[16px]">빵꾸러미 개수</span>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleDecrement}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                -
              </button>
              <span className="text-[16px]">{quantity}</span>
              <button 
                onClick={handleIncrement}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  quantity >= packageData.quantity ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100'
                }`}
                disabled={quantity >= packageData.quantity}  // 남은 수량에 도달하면 버튼 비활성화
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <span className="text-[16px] font-bold">총계</span>
            <span className="text-[18px] font-bold">{(packageData.price * quantity).toLocaleString()}원</span>
          </div>
        </div>
      </div>

      <PaymentButton 
        onClick={handleConfirm} 
        text={`${quantity}개 구매하기`} 
      />
    </div>
  )
} 