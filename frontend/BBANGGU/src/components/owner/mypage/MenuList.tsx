import { Link } from 'react-router-dom';
import pickupTimeIcon from '@/assets/icons/pickup-time-icon.svg';
import settlementIcon from '@/assets/icons/settlement-icon.svg';

export function MenuList() {
  return (
    <div className="px-6 space-y-3">
      <Link 
        to="/owner/pickup-time"
        className="flex items-center justify-between p-4 rounded-2xl border border-[#D9D9D9] bg-[#F2F2F2]"
      >
        <span className="text-gray-900 font-medium">픽업 시간 설정</span>
        <img src={pickupTimeIcon} alt="픽업 시간" className="w-5 h-5" />
      </Link>

      <Link 
        to="/owner/settlement/edit"
        className="flex items-center justify-between p-4 rounded-2xl border border-[#D9D9D9] bg-[#F2F2F2]"
      >
        <span className="text-gray-900 font-medium">거래 및 정산</span>
        <img src={settlementIcon} alt="거래 및 정산" className="w-6 h-6" />
      </Link>
    </div>
  );
}