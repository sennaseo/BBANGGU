import React, { useState, useEffect, useMemo } from 'react';
import { getTodayReservations, cancelReservation, completePickup, ReservationStatus } from '../../../../api/owner/reservation';
import { Menu, Transition, Dialog } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

interface CustomerListProps {
  bakeryId: number;
  onReservationsUpdate: (reservations: ReservationInfo[]) => void;
}

// 취소 사유 목록 추가
const CANCEL_REASONS = [
  '재고 소진',
  '영업 종료',
  '주문 오류',
  '품질 문제',
  '기타 (직접입력)'
] as const;

// 취소 모달 컴포넌트
const CancelModal = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: (reason: string) => void;
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(CANCEL_REASONS[0]);
  const [customReason, setCustomReason] = useState('');

  const handleConfirm = () => {
    const finalReason = selectedReason === '기타 (직접입력)' ? customReason : selectedReason;
    if (!finalReason.trim()) {
      alert('취소 사유를 입력해주세요.');
      return;
    }
    onConfirm(finalReason);
    onClose();
    // 상태 초기화
    setSelectedReason(CANCEL_REASONS[0]);
    setCustomReason('');
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* 모달 컨테이너 */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6">
          <Dialog.Title className="text-lg font-bold text-gray-900 mb-4">
            주문 취소 사유 선택
          </Dialog.Title>

          <div className="space-y-3">
            {CANCEL_REASONS.map((reason) => (
              <label key={reason} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="cancelReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="text-[#FC973B] focus:ring-[#FC973B]"
                />
                <span className="text-gray-700">{reason}</span>
              </label>
            ))}

            {selectedReason === '기타 (직접입력)' && (
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="취소 사유를 입력해주세요"
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-[#FC973B]/20 focus:border-[#FC973B]"
              />
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              className="flex-1 p-3 text-[#666666] font-medium"
              onClick={onClose}
            >
              돌아가기
            </button>
            <button
              className="flex-1 p-3 font-medium bg-[#fc973b] text-white rounded-full"
              onClick={handleConfirm}
            >
              취소하기
            </button>
          </div>
        </Dialog.Panel>
        </div>
    </Dialog>
  );
};

// 취소 사유 모달 컴포넌트 추가
const CancelReasonModal = ({ 
  isOpen, 
  onClose, 
  reason 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  reason: string;
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6">
          <Dialog.Title className="text-lg font-bold text-gray-900 mb-2">
            취소 사유
          </Dialog.Title>
          <p className="text-gray-600 text-[15px] whitespace-pre-wrap break-words">
            {reason}
          </p>
          <div className="mt-6 flex justify-end">
          <button 
              onClick={onClose}
              className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
            >
              확인
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

// 전화번호 안심번호 변환 함수 수정
const maskPhoneNumber = (phone: string) => {
  // 기존 번호에서 하이픈 제거하고 숫자만 추출
  const numbers = phone.replace(/-/g, '');
  
  // 010을 0507로 변경하고 나머지는 마스킹
  const safeNumber = numbers.replace(/^010/, '0507');
  
  // 안심번호 형식으로 포맷팅 (0507-****-1234)
  return safeNumber.replace(/(\d{4})(\d{4})(\d{4})/, '$1-****-$3');
};

// 정렬 타입 정의
type SortType = 'PAYMENT_TIME' | 'PICKUP_PENDING';

// 정렬 옵션 상수 추가
const SORT_OPTIONS = [
  { value: 'PAYMENT_TIME', label: '최근 결제순' },
  { value: 'PICKUP_PENDING', label: '픽업 대기순' }
] as const;

// ReservationInfo 인터페이스 수정
export interface ReservationInfo {
  reservationId: number;  // API 응답과 일치
  name: string;
  profileImageUrl: string | null;
  phone: string;
  paymentTime: string;
  status: ReservationStatus;
  quantitiy: number;
  cancelReason?: string;
}

export const CustomerList: React.FC<CustomerListProps> = ({ bakeryId, onReservationsUpdate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservations, setReservations] = useState<ReservationInfo[]>([]);
  const [totalNum, setTotalNum] = useState(0);
  const [endTime, setEndTime] = useState('20:00');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);
  const [sortType, setSortType] = useState<SortType>('PAYMENT_TIME');
  const [selectedCancelReason, setSelectedCancelReason] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true);
        // 예약 정보 조회
        const response = await getTodayReservations(bakeryId);
        console.log('예약 조회 결과:', response);

        if (response.data.infos) {
          setReservations(response.data.infos);
          onReservationsUpdate(response.data.infos);
          setTotalNum(response.data?.totalNum || 0);
          setEndTime(response.data?.endTime || '20:00');
        }
      } catch (error) {
        console.error('예약 정보 조회 실패:', error);
        setError('예약 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (bakeryId) {  // bakeryId가 있을 때만 호출
      fetchReservations();
    }
  }, [bakeryId]);

  // 시간 포맷팅 함수
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  // 상태에 따른 스타일과 텍스트를 반환하는 함수 수정
  const getStatusStyle = (status: ReservationStatus): { style: string; text: string; icon: string } => {
    switch (status) {
      case 'PENDING':
        return {
          style: 'text-gray-500',
          text: '결제완료',
          icon: `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          `
        };
      case 'CONFIRMED':
        return {
          style: 'text-blue-500',
          text: '픽업대기',
          icon: `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 4V8L10.6667 9.33333" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2"/>
            </svg>
          `
        };
      case 'COMPLETED':
        return {
          style: 'text-[#FC973B]',
          text: '픽업완료',
          icon: `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          `
        };
      case 'CANCELED':
        return {
          style: 'text-red-500',
          text: '주문취소',
          icon: `
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L12 12M4 12L12 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          `
        };
      default:
        return {
          style: 'text-gray-500',
          text: '상태없음',
          icon: ''
        };
    }
  };

  // 정렬된 예약 목록 계산 수정
  const sortedReservations = useMemo(() => {
    return [...reservations].sort((a, b) => {
      // 취소된 예약은 맨 아래로
      if (a.status === 'CANCELED' && b.status !== 'CANCELED') return 1;
      if (a.status !== 'CANCELED' && b.status === 'CANCELED') return -1;

      if (sortType === 'PICKUP_PENDING') {
        // 픽업 대기 상태를 우선 정렬
        if (a.status === 'CONFIRMED' && b.status !== 'CONFIRMED') return -1;
        if (a.status !== 'CONFIRMED' && b.status === 'CONFIRMED') return 1;
      }
      
      // 같은 상태면 결제 시간순 정렬
      return new Date(b.paymentTime).getTime() - new Date(a.paymentTime).getTime();
    });
  }, [reservations, sortType]);

  // 픽업 완료 처리 함수 수정
  const handlePickupComplete = async (reservationId: number) => {
    try {
      if (window.confirm('픽업 완료 처리하시겠습니까?')) {
        const response = await completePickup(reservationId);

        if (response.data) {
          // 성공 시 UI 업데이트
          setReservations(prev => prev.map(reservation => 
            reservation.reservationId === reservationId
              ? { ...reservation, status: 'COMPLETED' }
              : reservation
          ));

          // 상위 컴포넌트 상태 업데이트
          onReservationsUpdate(reservations.map(reservation => 
            reservation.reservationId === reservationId
              ? { ...reservation, status: 'COMPLETED' }
              : reservation
          ));

          alert('픽업 완료 처리되었습니다.');
        }
      }
    } catch (error) {
      console.error('픽업 완료 처리 실패:', error);
      alert('픽업 완료 처리 중 오류가 발생했습니다.');
    }
  };

  // 주문 취소 처리 함수 수정
  const handleCancelReservation = (reservationId: number) => {
    console.log('취소할 예약 데이터:', {
      reservationId,
      reservation: reservations.find(r => r.reservationId === reservationId)
    });
    
    setSelectedReservationId(reservationId);
    setIsCancelModalOpen(true);
  };

  const handleCancelConfirm = async (reason: string) => {
    if (!selectedReservationId) return;

    try {
      const response = await cancelReservation({
        reservationId: selectedReservationId,
        cancelReason: reason
      });

      if (response.data) {
        // 상태 업데이트
        setReservations(prev => prev.map(reservation => 
          reservation.reservationId === selectedReservationId
            ? { ...reservation, status: 'CANCELED', cancelReason: reason }
            : reservation
        ));
        alert('주문이 취소되었습니다.');
      }
    } catch (error) {
      console.error('주문 취소 실패:', error);
      alert('주문 취소 중 오류가 발생했습니다.');
    } finally {
      setIsCancelModalOpen(false);
      setSelectedReservationId(null);
    }
  };

  if (isLoading) return <div className="text-center py-4">로딩 중...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <>
      <div className="bg-white rounded-[20px] border border-gray-100">
        {/* 헤더 부분 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[20px] font-bold text-[#242424]">오늘 픽업할 고객</h2>
              <p className="mt-1 text-[14px] text-gray-500">
                픽업 마감 {endTime} · 전체 {totalNum}명
                (완료 {reservations.filter(r => r.status === 'COMPLETED').length}명)
              </p>
            </div>
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors text-sm">
                {SORT_OPTIONS.find(option => option.value === sortType)?.label}
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Menu.Button>
              
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Menu.Items className="absolute right-0 mt-1 w-32 origin-top-right 
                  bg-white rounded-lg shadow-lg border border-gray-100 
                  focus:outline-none z-10 py-1"
                >
                  {SORT_OPTIONS.map((option) => (
                    <Menu.Item key={option.value}>
                      {({ active }) => (
                        <button
                          onClick={() => setSortType(option.value as SortType)}
                          className={`
                            ${active ? 'bg-gray-50' : ''}
                            ${sortType === option.value ? 'text-[#FC973B]' : 'text-gray-600'}
                            w-full text-left px-3 py-1.5 text-sm
                          `}
                        >
                          {option.label}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>

        {/* 리스트 부분 */}
        <div className="divide-y divide-gray-100">
          {sortedReservations.map((reservation, index) => {
            const statusInfo = getStatusStyle(reservation.status);
            
            return (
              <div 
                key={index} 
                className={`p-5 flex items-center justify-between transition-all duration-200
                  ${reservation.status !== 'CANCELED' ? 'hover:bg-gray-50' : ''}`}
              >
                {/* 왼쪽: 고객 정보 */}
                <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <span className="text-[16px] font-bold text-[#242424]">
                      {reservation.name}
                    </span>
                    <div className="flex items-center gap-1.5 text-[13px]" 
                      dangerouslySetInnerHTML={{ 
                        __html: `
                          <span class="${statusInfo.style}">
                            ${statusInfo.icon}
                          </span>
                          <span class="${statusInfo.style} font-medium">
                            ${statusInfo.text}
                          </span>
                        `
                      }} 
                    />
                  </div>
                  <div className="mt-1 flex items-center gap-3">
                    <span className="text-[14px] text-gray-600">
                      빵꾸러미 {reservation.quantitiy}개
                    </span>
                    <span className="text-[14px] text-gray-500">
                      {formatTime(reservation.paymentTime)} 결제
                    </span>
                  </div>
                </div>

                {/* 오른쪽: 더보기 메뉴 */}
                {(reservation.status === 'CONFIRMED' || reservation.status === 'COMPLETED' || reservation.status === 'CANCELED') && (
                  <Menu as="div" className="relative">
                    <Menu.Button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <EllipsisVerticalIcon className="w-5 h-5 text-gray-500" />
                    </Menu.Button>
                    
                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-lg shadow-lg border border-gray-100 focus:outline-none z-10">
                        <div className="p-1">
                          {/* 전화번호 메뉴 아이템 */}
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(reservation.phone);
                                  alert('전화번호가 복사되었습니다.');
                                }}
                                className={`
                                  ${active ? 'bg-gray-50' : ''}
                                  group flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700
                                `}
                              >
                                <svg 
                                  className="w-4 h-4" 
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor"
                                >
                                  <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  />
                                </svg>
                                <div className="flex flex-col items-start">
                                  <span className="text-gray-900">연락처</span>
                                  <span className="text-gray-500 text-xs">
                                    {maskPhoneNumber(reservation.phone)}
                                  </span>
                                </div>
                              </button>
                            )}
                          </Menu.Item>

                          {/* 픽업 완료 버튼 - CONFIRMED 상태일 때만 */}
                          {reservation.status === 'CONFIRMED' && (
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => handlePickupComplete(reservation.reservationId)}
                                  className={`
                                    ${active ? 'bg-[#FFF9F5] text-[#FC973B]' : 'text-gray-700'}
                                    group flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm
                                  `}
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  픽업완료
                                </button>
                              )}
                            </Menu.Item>
                          )}

                          {/* 주문 취소 버튼 */}
                          {!['COMPLETED', 'CANCELED'].includes(reservation.status) && (
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => handleCancelReservation(reservation.reservationId)}
                                  className={`
                                    ${active ? 'bg-red-50 text-red-600' : 'text-gray-700'}
                                    group flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm
                                  `}
                                >
                                  <svg 
                                    className="w-4 h-4" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                  >
                                    <path 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      strokeWidth={2} 
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                  주문취소
                                </button>
                              )}
                            </Menu.Item>
                          )}

                          {/* 취소 사유 보기 버튼 - CANCELED 상태일 때만 */}
                          {reservation.status === 'CANCELED' && (
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => {
                                    setSelectedCancelReason(reservation.cancelReason || '취소 사유가 없습니다.');
                                    setIsReasonModalOpen(true);
                                  }}
                                  className={`
                                    ${active ? 'bg-gray-50' : ''}
                                    group flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700
                                  `}
                                >
                                  <svg 
                                    className="w-4 h-4" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                  >
                                    <path 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      strokeWidth={2} 
                                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  취소 사유 보기
                                </button>
                              )}
                            </Menu.Item>
                          )}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
              </div>
            );
          })}
          </div>
      </div>

      {/* 취소 모달 */}
      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
      />

      {/* 취소 사유 모달 */}
      <CancelReasonModal
        isOpen={isReasonModalOpen}
        onClose={() => setIsReasonModalOpen(false)}
        reason={selectedCancelReason}
      />
    </>
  );
}; 