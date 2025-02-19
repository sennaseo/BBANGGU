import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import pickupTimeIcon from '../../../../public/icons/pickup-time-icon.svg';
import settlementIcon from '../../../../public/icons/settlement-icon.svg';
import { getBakeryByUserId, getSettlementInfo } from '../../../api/bakery/bakery';
import { getAllPickupTimes } from '../../../api/pickup/pickup';

export function MenuList() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handlePickupTimeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 먼저 가게 정보를 조회하여 bakeryId를 얻음
      const bakeryInfo = await getBakeryByUserId();
      // bakeryId로 모든 픽업 시간 조회
      const pickupTimes = await getAllPickupTimes(bakeryInfo.bakeryId);
      
      navigate('/owner/pickup-time', {
        state: {
          bakeryId: bakeryInfo.bakeryId,
          pickupTimes: {
            monday: pickupTimes.monday,
            tuesday: pickupTimes.tuesday,
            wednesday: pickupTimes.wednesday,
            thursday: pickupTimes.thursday,
            friday: pickupTimes.friday,
            saturday: pickupTimes.saturday,
            sunday: pickupTimes.sunday
          }
        }
      });
    } catch (error) {
      console.error('픽업 시간 조회 실패:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('픽업 시간을 불러오는데 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettlementClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 먼저 가게 정보를 조회하여 bakeryId를 얻음
      const bakeryInfo = await getBakeryByUserId();
      // bakeryId로 정산 정보 조회
      const settlementInfo = await getSettlementInfo(bakeryInfo.bakeryId);
      
      navigate('/owner/settlement/edit', {
        state: {
          settlementInfo: {
            settlementId: settlementInfo.settlementId,
            bankName: settlementInfo.bankName,
            accountHolderName: settlementInfo.accountHolderName,
            accountNumber: settlementInfo.accountNumber,
            emailForTaxInvoice: settlementInfo.emailForTaxInvoice,
            businessLicenseFileUrl: settlementInfo.businessLicenseFileUrl
          }
        }
      });
    } catch (error) {
      console.error('정산 정보 조회 실패:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('정산 정보를 불러오는데 실패했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-6 space-y-3">
      <button 
        onClick={handlePickupTimeClick}
        disabled={isLoading}
        className="w-full flex items-center justify-between p-4 rounded-2xl border border-[#D9D9D9] bg-[#F2F2F2]"
      >
        <span className="text-gray-900 font-medium">
          픽업 시간 설정
        </span>
        <img src={pickupTimeIcon} alt="픽업 시간" className="w-5 h-5" />
      </button>

      <button 
        onClick={handleSettlementClick}
        disabled={isLoading}
        className="w-full flex items-center justify-between p-4 rounded-2xl border border-[#D9D9D9] bg-[#F2F2F2]"
      >
        <span className="text-gray-900 font-medium">
          거래 및 정산
        </span>
        <img src={settlementIcon} alt="거래 및 정산" className="w-6 h-6" />
      </button>
    </div>
  );
}