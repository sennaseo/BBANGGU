import { Customer } from '../../../../types/owner';

interface CustomerListProps {
  customers: Customer[];
  sortByPaymentTime: boolean;
  onTogglePickup: (id: number) => void;
  onSort: () => void;
}

export const CustomerList = ({
  customers,
  sortByPaymentTime,
  onTogglePickup,
  onSort,
}: CustomerListProps) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col mb-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-[20px] font-bold">오늘 픽업할 고객</h2>
          <span className="text-[#FC973B] font-medium">20:00 마감</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 pl-[2px]">
            총 6명 중 {customers.filter(c => c.isPickedUp).length}명 픽업 완료
          </span>
          <button 
            onClick={onSort}
            className="flex items-center gap-1 text-sm text-[#FC973B]"
          >
            <span>{sortByPaymentTime ? '결제순' : '미픽업순'}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {customers.map((customer) => (
          <div 
            key={customer.id} 
            className={`flex items-center justify-between bg-white p-4 rounded-[10px] border ${
              customer.isPickedUp ? 'border-[#FC973B]' : 'border-gray-100'
            }`}
            onClick={() => onTogglePickup(customer.id)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-[#333333]">{customer.name}</p>
                  <span className="text-xs text-gray-400">{customer.paymentTime} 결제</span>
                </div>
                <p className={`text-sm ${customer.isPickedUp ? 'text-[#FC973B]' : 'text-gray-400'}`}>
                  {customer.isPickedUp ? '픽업 완료' : '결제 완료'}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              빵꾸러미 {customer.breadCount}개
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 