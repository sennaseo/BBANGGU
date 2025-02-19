import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../../components/owner/header/Header';
import ProgressBar from './components/Progress.Bar';
import { PACKAGE_STEPS, TOTAL_PACKAGE_STEPS } from './constants/PakageSteps';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import breadBagIcon from '/bakery/bread_pakage.svg';
import wonIcon from '/bakery/won_icon.png';
import axios from 'axios';
import { getUserInfo } from '../../../api/user/user';
import { getBakeryByOwner, getPickupTime, updatePickupTime } from '../../../api/owner/bakery';
import { registerPackage } from '../../../api/owner/package';

// 경고 아이콘을 직접 SVG로 구현
const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" 
      stroke="#FC973B" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// 시간 옵션 생성 함수 추가
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of ['00', '30']) {
      const time = `${hour.toString().padStart(2, '0')}:${minute}`;
      options.push(time);
    }
  }
  return options;
};

// 타입 정의 수정
interface LocationState {
  mode: 'auto' | 'manual';
  price: number;
  quantity: number;
  totalPrice: number;
  selectedPackage?: number;
}

const PackageSalesSetting: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    console.log('PackageSalesSetting received state:', location.state);
    if (!location.state) {
      alert('잘못된 접근입니다.');
      navigate(-1);
      return;
    }

    // 값 검증 추가
    const { price, quantity, totalPrice } = location.state as LocationState;
    if (isNaN(price) || isNaN(quantity) || isNaN(totalPrice)) {
      console.error('Invalid numeric values:', { price, quantity, totalPrice });
      alert('가격 정보가 올바르지 않습니다.');
      navigate(-1);
      return;
    }
  }, [location.state, navigate]);

  const { price, quantity, totalPrice } = location.state as LocationState;
  const [packageName, setPackageName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [bakeryId, setBakeryId] = useState<number | null>(null);
  const [isLoadingPickupTime, setIsLoadingPickupTime] = useState(true);

  const timeOptions = generateTimeOptions();

  // 베이커리 정보와 픽업 시간 조회
  useEffect(() => {
    const fetchBakeryInfo = async () => {
      try {
        const userData = await getUserInfo();
        
        if (userData.role !== 'OWNER') {
          navigate('/');
          return;
        }

        try {
          const bakeryData = await getBakeryByOwner();
          setBakeryId(bakeryData.bakeryId);

          // 픽업 시간 조회
          try {
            const pickupTime = await getPickupTime(bakeryData.bakeryId);
            console.log('Fetched pickup time:', pickupTime);
            setStartTime(pickupTime.startTime);
            setEndTime(pickupTime.endTime);
          } catch (error) {
            console.error('Error fetching pickup time:', error);
            // 픽업 시간 조회 실패는 치명적이지 않으므로 기본값 사용
          } finally {
            setIsLoadingPickupTime(false);
          }

        } catch (error) {
          console.error('Error fetching bakery:', error);
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            alert('베이커리 정보를 찾을 수 없습니다. 베이커리를 먼저 등록해주세요.');
            navigate('/owner/bakery/register');
            return;
          }
          throw error;
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        alert('사장님 정보를 가져오는데 실패했습니다.');
        navigate('/');
      }
    };

    fetchBakeryInfo();
  }, [navigate]);

  // API 호출 함수 수정
  const handleRegisterPackage = async () => {
    if (!bakeryId) {
      alert('베이커리 정보를 찾을 수 없습니다.');
      return;
    }

    if (!packageName || !startTime || !endTime) {
      alert('모든 정보를 입력해주세요.');
      return;
    }

    try {
      // 1. 빵꾸러미 등록
      const packageData = {
        bakeryId,
        name: packageName,
        price,
        quantity
      };

      console.log('빵꾸러미 등록 요청:', packageData);
      await registerPackage(packageData);

      // 2. 픽업 시간 설정
      try {
        await updatePickupTime(bakeryId, startTime, endTime);
      } catch (error) {
        console.error('픽업 시간 설정 실패:', error);
        // 픽업 시간 설정 실패는 크리티컬하지 않으므로 계속 진행
      }

      alert('빵꾸러미가 등록되었습니다.');
      navigate('/owner/main');
    } catch (error) {
      console.error('패키지 등록 실패:', error);
      if (axios.isAxiosError(error)) {
        console.log('에러 응답:', error.response?.data);
        alert(error.response?.data?.message || '패키지 등록에 실패했습니다.');
      }
    }
  };

  // 시간 변경 핸들러
  const handleTimeChange = async (type: 'start' | 'end', value: string) => {
    if (!bakeryId) return;

    try {
      if (type === 'start') {
        setStartTime(value);
        if (endTime) {
          await updatePickupTime(bakeryId, value, endTime);
        }
      } else {
        setEndTime(value);
        if (startTime) {
          await updatePickupTime(bakeryId, startTime, value);
        }
      }
    } catch (error) {
      console.error('Error updating pickup time:', error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || '픽업 시간 수정에 실패했습니다.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        title="판매 설정" 
        onBack={() => navigate(-1)}
      />
      
      <div className="mt-4">
        <ProgressBar 
          currentStep={PACKAGE_STEPS.CONFIRM} 
          totalSteps={TOTAL_PACKAGE_STEPS}
        />
      </div>

      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        {/* 빵꾸러미 이름 */}
        <div className="mb-8">
          <h3 className="text-[16px] font-bold text-[#242424] mb-2">빵꾸러미 이름</h3>
          <p className="text-[14px] text-gray-600 mb-4">
            담기는 음식을 고려하여 알맞은 꾸러미 이름을 지어주세요
          </p>
          <input
            type="text"
            placeholder="ex) 귀가롱러마꾸러미"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            className="w-full px-4 py-3 rounded-[8px] border border-[#E5E5E5] text-[16px] placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FC973B]"
          />
        </div>

        {/* 오늘의 판매/픽업 시간 설정 */}
        <div className="mb-8">
          <h3 className="text-[16px] font-bold text-[#242424] mb-2">오늘의 판매/픽업 시간 설정</h3>
          <p className="text-[14px] text-gray-600 mb-4">
            판매 및 픽업을 원하는 시간을 설정해주세요.
            <br/>
            설정한 시간에 판매가 시작되며, 고객님이 픽업할 수 있습니다
          </p>

          <div className="grid grid-cols-2 gap-4">
            {/* 시작 시간 */}
            <div>
              <p className="text-[14px] text-[#242424] mb-2">시작 시간</p>
              <div className="relative">
                <select
                  value={startTime}
                  onChange={(e) => handleTimeChange('start', e.target.value)}
                  className="w-full px-4 py-3 rounded-[8px] border border-[#E5E5E5] text-[16px] appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#FC973B]"
                  disabled={isLoadingPickupTime}
                >
                  <option value="">시간 선택</option>
                  {timeOptions.map((time) => (
                    <option key={`start-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8v4l3 3" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="9" stroke="#6B7280" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* 종료 시간 */}
            <div>
              <p className="text-[14px] text-[#242424] mb-2">종료 시간</p>
              <div className="relative">
                <select
                  value={endTime}
                  onChange={(e) => handleTimeChange('end', e.target.value)}
                  className="w-full px-4 py-3 rounded-[8px] border border-[#E5E5E5] text-[16px] appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#FC973B]"
                  disabled={isLoadingPickupTime}
                >
                  <option value="">시간 선택</option>
                  {timeOptions.map((time) => (
                    <option key={`end-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 8v4l3 3" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="12" r="9" stroke="#6B7280" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 경고 메시지 */}
          <div className="mt-4 flex items-start gap-2 text-[14px] text-[#FC973B]">
            <WarningIcon />
            <p>저장된 요일의 시간이 있다면 자동으로 불러와져요</p>
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
                  {packageName || '빵꾸러미 이름을 입력해주세요'}
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
                    {price.toLocaleString()}원
                  </p>
                </div>
              </div>

              {/* 수량 정보 */}
              <div className="flex items-center gap-3">
                <img src={breadBagIcon} alt="quantity" className="w-6 h-6" />
                <div>
                  <p className="text-[14px] text-[#6B7280] mb-1">판매 수량</p>
                  <p className="text-[16px] font-medium text-[#242424]">
                    {quantity}개
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
                  <p className="text-[16px] font-medium text-[#242424]">{startTime || '시간 선택'}</p>
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
                  <p className="text-[16px] font-medium text-[#242424]">{endTime || '시간 선택'}</p>
                </div>
              </div>
            </div>

            {/* 총 판매 금액 */}
            <div className="h-[1px] bg-[#E5E5E5] my-4" />
            <div className="flex justify-between items-center">
              <span className="text-[16px] text-[#242424]">총 판매 금액</span>
              <span className="text-[18px] font-bold text-[#FC973B]">
                {totalPrice.toLocaleString()}원
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
            onClick={handleRegisterPackage}
            className="w-full bg-[#FC973B] text-white py-4 rounded-[8px] text-[16px] font-medium"
            disabled={!packageName || !startTime || !endTime}
          >
            빵꾸러미 판매 시작
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageSalesSetting; 