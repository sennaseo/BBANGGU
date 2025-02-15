import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../../components/owner/header/Header';
import breadBagIcon from '../../../assets/images/bakery/bread_pakage.svg';
import wonIcon from '../../../assets/images/bakery/won_icon.png';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { registerPackage, getPickupTime, updatePickupTime, updatePackage } from '../../../api/owner/package';

interface PackageForm {
  name: string;
  price: number;
  quantity: number;
  startTime: string;
  endTime: string;
}

export default function PackageSettingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = location.state?.isEditing;
  const packageData = location.state?.packageData;

  // 기본 시간 상수
  const DEFAULT_TIMES = {
    startTime: '',
    endTime: ''
  };

  const [form, setForm] = useState<PackageForm>({
    name: isEditing ? packageData?.name : '',
    price: isEditing ? packageData?.price : 0,
    quantity: isEditing ? packageData?.quantity : 1,
    startTime: DEFAULT_TIMES.startTime,
    endTime: DEFAULT_TIMES.endTime
  });
  const [isPriceEditing, setIsPriceEditing] = useState(false);
  const [tempPrice, setTempPrice] = useState('');
  const MIN_PRICE = 1000;  // 최소 가격 상수 추가
  const MAX_PRICE = 100000;  // 최대 가격 상수
  const [isLoading, setIsLoading] = useState(false);
  const [defaultPickupTime, setDefaultPickupTime] = useState<{
    startTime: string;
    endTime: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    setForm(prev => ({
      ...prev,
      quantity: type === 'increase' ? prev.quantity + 1 : Math.max(1, prev.quantity - 1)
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, '');
    const value = parseInt(inputValue);
    
    if (inputValue === '') {
      setTempPrice('');
    } else if (!isNaN(value)) {
      if (value > MAX_PRICE) {
        setTempPrice(MAX_PRICE.toString());
      } else {
        setTempPrice(inputValue);
      }
    }
  };

  const handlePriceBlur = () => {
    let finalPrice = 0;

    if (tempPrice !== '') {
      const value = parseInt(tempPrice);
      if (!isNaN(value)) {
        if (value > MAX_PRICE) {
          alert('최대 설정 가능 금액은 10만원입니다.');
          finalPrice = MAX_PRICE;
        } else if (value < MIN_PRICE) {
          alert('최소 설정 가능 금액은 1,000원입니다.');
          finalPrice = MIN_PRICE;
        } else {
          finalPrice = value;
        }
        // 100원 단위로 반올림
        finalPrice = Math.round(finalPrice / 100) * 100;
      }
    }

    setForm(prev => ({ ...prev, price: finalPrice }));
    setIsPriceEditing(false);
    setTempPrice('');
  };

  // 픽업 시간 조회
  useEffect(() => {
    const fetchPickupTime = async () => {
      try {
        const response = await getPickupTime(1);
        const pickupTimeData = response?.data;

        // 타입 가드를 사용하여 데이터 유효성 검사
        if (
          pickupTimeData && 
          typeof pickupTimeData.startTime === 'string' && 
          typeof pickupTimeData.endTime === 'string'
        ) {
          setForm(prev => ({
            ...prev,
            startTime: pickupTimeData.startTime,
            endTime: pickupTimeData.endTime
          }));
          
          setDefaultPickupTime({
            startTime: pickupTimeData.startTime,
            endTime: pickupTimeData.endTime
          });
        } else {
          console.warn('유효하지 않은 픽업 시간 데이터:', response);
        }
      } catch (error) {
        console.error('픽업 시간 조회 실패:', error);
      }
    };

    fetchPickupTime();
  }, []);

  // 현재 요일 가져오는 함수 추가
  const getCurrentDay = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    return days[today];
  };

  const handleSubmit = async () => {
    if (!form.name || form.price < MIN_PRICE || !form.startTime || !form.endTime) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing && packageData?.packageId) {
        await updatePackage(packageData.packageId, {
          bakeryId: packageData.bakeryId,
          name: form.name,
          price: form.price,
          quantity: form.quantity
        });

        // 픽업 시간이 변경된 경우에만 API 호출
        if (defaultPickupTime &&
            (defaultPickupTime.startTime !== form.startTime ||
             defaultPickupTime.endTime !== form.endTime)) {
          
          const currentDay = getCurrentDay();
          await updatePickupTime(1, {
            [currentDay]: {
              startTime: form.startTime,
              endTime: form.endTime
            }
          });
        }

        alert('빵꾸러미가 수정되었습니다.');
        navigate('/owner/main');
      } else {
        // 등록 API 호출
        await registerPackage({
          bakeryId: 1,
          name: form.name,
          price: form.price,
          quantity: form.quantity
        });
        alert('빵꾸러미가 등록되었습니다.');
      }

      navigate('/owner/main');
    } catch (error: any) {
      alert(error.response?.data?.message || `빵꾸러미 ${isEditing ? '수정' : '등록'} 중 오류가 발생했습니다.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        title={isEditing ? "빵꾸러미 수정" : "빵꾸러미 설정"}
        onBack={() => navigate(-1)}
        rightButton={{
          text: isLoading ? "저장 중..." : "저장",
          onClick: handleSubmit,
          disabled: isLoading
        }}
      />

      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        {/* 빵꾸러미 이름 */}
        <div className="mb-8">
          <h3 className="text-[16px] font-bold text-[#242424] mb-2">빵꾸러미 이름</h3>
          <p className="text-[14px] text-gray-600 mb-4">
            담기는 음식을 고려하여 알맞은 꾸러미 이름을 지어주세요
          </p>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="ex) 귀가롱러마꾸러미"
            className="w-full px-4 py-3 rounded-[8px] border border-[#E5E5E5] text-[16px] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FC973B]"
          />
        </div>

        {/* 빵꾸러미 가격 */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            빵꾸러미 가격
          </label>
          {isPriceEditing ? (
            <input
              type="text"
              value={tempPrice}
              onChange={handlePriceChange}
              onBlur={handlePriceBlur}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#FC973B]"
              placeholder="최종 판매 가격을 입력하세요"
              autoFocus
            />
          ) : (
            <div 
              onClick={() => setIsPriceEditing(true)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[4px] cursor-text"
            >
              <div className="flex flex-col gap-1">
                {/* 할인 전 가격 (입력된 가격의 2배) */}
                <span className="text-gray-400 line-through text-sm">
                  {(form.price * 2).toLocaleString()}원
                </span>
                {/* 실제 판매가격 */}
                <span className="text-lg font-bold text-[#FC973B]">
                  {form.price.toLocaleString()}원
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (50% 할인)
                  </span>
                </span>
              </div>
            </div>
          )}
          <p className="mt-1 text-sm text-gray-500">
            * 입력하신 가격이 50% 할인된 최종 판매 가격입니다
          </p>
        </div>

        {/* 빵꾸러미 판매 개수 */}
        <div className="mb-8">
          <h3 className="text-[16px] font-bold text-[#242424] mb-2">빵꾸러미 판매 개수</h3>
          <p className="text-[14px] text-gray-600 mb-4">하루에 몇 개의 빵꾸러미를 판매할까요?</p>
          <div className="flex items-center bg-white rounded-[8px] border border-[#E5E5E5] px-4 py-3">
            <span className="text-[14px] text-[#242424]">빵꾸러미 개수</span>
            <span className="flex-1" />
            <button 
              onClick={() => handleQuantityChange('decrease')}
              className="w-8 h-8 flex items-center justify-center text-[#242424] bg-gray-100 rounded-full 
                hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <span className="w-[40px] text-center text-[16px] font-medium">
              {form.quantity}
            </span>
            <button 
              onClick={() => handleQuantityChange('increase')}
              className="w-8 h-8 flex items-center justify-center text-[#242424] bg-gray-100 rounded-full 
                hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 오늘의 판매/픽업 시간 설정 */}
        <div className="mb-8">
          <h3 className="text-[16px] font-bold text-[#242424] mb-2">오늘의 판매/픽업 시간 설정</h3>
          <p className="text-[14px] text-gray-600 mb-4">
            판매 및 픽업을 원하는 시간을 설정해주세요.<br/>
            설정한 시간에 판매가 시작되며, 고객님이 픽업할 수 있습니다
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[14px] text-[#242424] mb-2">시작 시간</p>
              <div className="relative">
                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-[8px] border border-[#E5E5E5] text-[16px] 
                    bg-white
                    appearance-none 
                    focus:outline-none focus:ring-2 focus:ring-[#FC973B]
                    [&::-webkit-calendar-picker-indicator]:bg-none
                    [&::-webkit-datetime-edit-fields-wrapper]:text-[#242424]
                    [&::-webkit-inner-spin-button]:appearance-none
                    [&::-webkit-clear-button]:appearance-none"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8v4l3 3" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="9" stroke="#6B7280" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <p className="text-[14px] text-[#242424] mb-2">종료 시간</p>
              <div className="relative">
                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-[8px] border border-[#E5E5E5] text-[16px] 
                    bg-white
                    appearance-none 
                    focus:outline-none focus:ring-2 focus:ring-[#FC973B]
                    [&::-webkit-calendar-picker-indicator]:bg-none
                    [&::-webkit-datetime-edit-fields-wrapper]:text-[#242424]
                    [&::-webkit-inner-spin-button]:appearance-none
                    [&::-webkit-clear-button]:appearance-none"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8v4l3 3" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="9" stroke="#6B7280" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" 
                stroke="#FC973B" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-[14px] text-[#FC973B]">
              저장된 요일의 시간이 있다면 자동으로 불러와져요
            </p>
          </div>
        </div>

        {/* 섹션 구분선 */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-[1px] bg-[#E5E5E5] flex-1" />
          <div className="flex items-center gap-2 px-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" 
                stroke="#FC973B" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[#FC973B] font-medium">최종 확인</span>
          </div>
          <div className="h-[1px] bg-[#E5E5E5] flex-1" />
        </div>

        {/* 최종 빵꾸러미 요약 */}
        <div className="mb-8">
          <h3 className="text-[16px] font-bold text-[#242424] mb-4">빵꾸러미 판매 정보</h3>
          <div className="bg-white rounded-[8px] shadow-[0_-2px_4px_-1px_rgba(0,0,0,0.06),0_4px_6px_-1px_rgba(0,0,0,0.1)] p-6">
            {/* 빵꾸러미 정보 */}
            <div className="flex items-start gap-3 mb-4">
              <img src={breadBagIcon} alt="bread bag" className="w-6 h-6 mt-1" />
              <div>
                <p className="font-medium text-[16px] text-[#242424] mb-1">
                  {form.name || '빵꾸러미 이름을 입력해주세요'}
                </p>
              </div>
            </div>

            {/* 구분선 */}
            <div className="h-[1px] bg-[#E5E5E5] my-4" />

            {/* 판매 정보 그리드 */}
            <div className="grid grid-cols-2 gap-6">
              {/* 가격 정보 */}
              <div className="flex items-center gap-3">
                <img src={wonIcon} alt="price" className="w-6 h-6" />
                <div>
                  <p className="text-[14px] text-[#6B7280] mb-1">판매 가격</p>
                  <p className="text-[16px] font-medium text-[#242424]">
                    {form.price.toLocaleString()}원
                  </p>
                </div>
              </div>

              {/* 수량 정보 */}
              <div className="flex items-center gap-3">
                <img src={breadBagIcon} alt="quantity" className="w-6 h-6" />
                <div>
                  <p className="text-[14px] text-[#6B7280] mb-1">판매 수량</p>
                  <p className="text-[16px] font-medium text-[#242424]">
                    {form.quantity}개
                  </p>
                </div>
              </div>

              {/* 시작 시간 */}
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#6B7280">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-[14px] text-[#6B7280] mb-1">판매 시작</p>
                  <p className="text-[16px] font-medium text-[#242424]">{form.startTime}</p>
                </div>
              </div>

              {/* 종료 시간 */}
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="#6B7280">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-[14px] text-[#6B7280] mb-1">판매 종료</p>
                  <p className="text-[16px] font-medium text-[#242424]">{form.endTime}</p>
                </div>
              </div>
            </div>

            {/* 총 판매 금액 */}
            <div className="h-[1px] bg-[#E5E5E5] my-4" />
            <div className="flex justify-between items-center">
              <span className="text-[16px] text-[#242424]">총 판매 금액</span>
              <span className="text-[18px] font-bold text-[#FC973B]">
                {(form.price * form.quantity).toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* 하단 경고 메시지 */}
        <div className="flex items-start gap-2 mb-4">
          <ExclamationTriangleIcon 
            className="w-5 h-5 text-[#FC973B] flex-shrink-0" 
          />
          <p className="text-[14px] text-[#FC973B]">
            빵꾸러미 등록 후에는 하루 동안 수정이 불가능합니다.<br/>
            내용을 한 번 더 확인해주세요!
          </p>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-auto pt-4">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full ${
              isLoading ? 'bg-gray-400' : 'bg-[#FC973B] hover:bg-[#e88934]'
            } text-white py-4 rounded-[8px] text-[16px] font-medium transition-colors`}
          >
            {isLoading ? '등록 중...' : '빵꾸러미 판매 시작'}
          </button>
        </div>
      </div>
    </div>
  );
} 