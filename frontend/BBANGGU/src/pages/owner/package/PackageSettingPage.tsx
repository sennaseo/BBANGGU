import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../../components/owner/header/Header';
import breadBagIcon from '../../../assets/images/bakery/bread_pakage.svg';
import wonIcon from '../../../assets/images/bakery/won_icon.png';
import { ExclamationTriangleIcon, CurrencyDollarIcon, HashtagIcon } from '@heroicons/react/24/outline';
import { registerPackage, getPickupTime, updatePickupTime, updatePackage } from '../../../api/owner/package';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { logout } from '../../../store/slices/authSlice';
import { setUserInfo, clearUserInfo } from '../../../store/slices/userSlice';
import { getUserInfo } from '../../../api/user/user';

interface PackageForm {
  bakeryId?: number;
  name: string;
  price: number;
  quantity: number;
  startTime: string;
  endTime: string;
}

export default function PackageSettingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redux 상태 가져오기
  const { accessToken } = useSelector((state: RootState) => state.auth);

  const isEditing = location.state?.isEditing;
  const packageData = location.state?.packageData;

  // 권한 체크 및 유저 정보 조회
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!accessToken) {
        navigate('/login');
        return;
      }

      try {
        const data = await getUserInfo();
        dispatch(setUserInfo({
          name: data.name,
          profileImageUrl: data.profileImageUrl,
          email: data.email,
          phone: data.phone,
          userId: data.userId,
          role: data.role as 'OWNER' | 'USER',
          addressRoad: data.addressRoad,
          addressDetail: data.addressDetail
        }));

        // 점주가 아닌 경우 메인으로 리다이렉트
        if (data.role !== 'OWNER') {
          dispatch(logout());
          dispatch(clearUserInfo());
          navigate('/');
          return;
        }

        // bakeryId 설정 (API 호출에 사용)
        if (data.userId) {
          setForm(prev => ({
            ...prev,
            bakeryId: data.userId
          }));
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        dispatch(logout());
        dispatch(clearUserInfo());
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [dispatch, navigate, accessToken]);

  // 기본 시간 상수
  const DEFAULT_TIMES = {
    startTime: '',
    endTime: ''
  };

  const [form, setForm] = useState<PackageForm>({
    bakeryId: isEditing ? packageData?.bakeryId : undefined,
    name: isEditing ? packageData?.name : '',
    price: isEditing ? packageData?.price : 0,
    quantity: isEditing ? packageData?.quantity : 1,
    startTime: DEFAULT_TIMES.startTime,
    endTime: DEFAULT_TIMES.endTime
  });
  const MIN_PRICE = 1000;  // 최소 가격 상수 추가
  // const MAX_PRICE = 100000;  // 최대 가격 상수
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
    const value = parseInt(e.target.value) || 0;  // 빈 문자열이나 NaN인 경우 0으로 설정
    setForm(prev => ({
      ...prev,
      price: value
    }));
  };

  const handlePriceBlur = () => {
    // 포커스를 잃었을 때만 최소가격 체크
    if (form.price < MIN_PRICE) {
      setForm(prev => ({
        ...prev,
        price: MIN_PRICE
      }));
      alert(`최소 ${MIN_PRICE.toLocaleString()}원 이상 입력해주세요.`);
    }
  };

  // 픽업 시간 조회
  useEffect(() => {
    const fetchPickupTime = async () => {
      if (!form.bakeryId) return;

      try {
        const response = await getPickupTime(form.bakeryId);
        console.log('픽업 시간 응답:', response); // 디버깅용
        
        if (response && response.data) {
          const pickupTimeData = response.data;
          setForm(prev => ({
            ...prev,
            startTime: pickupTimeData.startTime,
            endTime: pickupTimeData.endTime
          }));
          
          setDefaultPickupTime({
            startTime: pickupTimeData.startTime,
            endTime: pickupTimeData.endTime
          });
        }
      } catch (error) {
        console.error('픽업 시간 조회 실패:', error);
        setForm(prev => ({
          ...prev,
          startTime: '',
          endTime: ''
        }));
      }
    };

    fetchPickupTime();
  }, [form.bakeryId]);

  // 현재 요일 가져오는 함수 추가
  const getCurrentDay = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    return days[today];
  };

  const handleSubmit = async () => {
    if (!form.bakeryId) {
      alert('점주 정보를 불러올 수 없습니다.');
      return;
    }

    if (!form.name || form.price < MIN_PRICE || !form.startTime || !form.endTime) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing && packageData?.packageId) {
        await updatePackage(packageData.packageId, {
          bakeryId: form.bakeryId,
          name: form.name,
          price: form.price,
          quantity: form.quantity
        });

        // 픽업 시간이 변경된 경우에만 API 호출
        if (defaultPickupTime &&
            (defaultPickupTime.startTime !== form.startTime ||
             defaultPickupTime.endTime !== form.endTime)) {
          
          const currentDay = getCurrentDay();
          console.log('픽업 시간 수정 요청:', {
            bakeryId: form.bakeryId,
            [currentDay]: {
              startTime: form.startTime,
              endTime: form.endTime
            }
          });

          await updatePickupTime(form.bakeryId, {
            [currentDay]: {
              startTime: form.startTime,
              endTime: form.endTime
            }
          });
        }

        alert('빵꾸러미가 수정되었습니다.');
        navigate('/owner/main');
      } else {
        await registerPackage({
          bakeryId: form.bakeryId,
          name: form.name,
          price: form.price,
          quantity: form.quantity
        });
        alert('빵꾸러미가 등록되었습니다.');
      }

      navigate('/owner/main');
    } catch (error: any) {
      console.error('에러 발생:', error);
      // 401 에러 처리
      if (error.response?.status === 401 || error.message === '인증이 필요합니다.') {
        dispatch(logout());
        dispatch(clearUserInfo());
        navigate('/login');
        return;
      }
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

      <div className="flex-1 flex flex-col p-4">
        {/* 안내 문구 추가 */}
        <div className="mb-6">
          <h2 className="text-[18px] font-bold text-gray-900 mb-2">
            빵꾸러미 가격 설정
          </h2>
          <div className="bg-[#FFF5EC] rounded-[8px] p-4 space-y-2">
            <p className="text-[14px] text-[#FC973B] font-medium">
              💡 빵꾸러미 가격 설정 시 참고해주세요
            </p>
            <div className="space-y-1 text-[14px] text-gray-600">
              <p>• 빵꾸러미 가격은 안에 담길 빵들의 가격 합과 동일해야 해요</p>
              <p className="pl-4 text-[13px] text-gray-500">
                예시) 10,000원 빵꾸러미 = 3,000원 + 4,000원 + 3,000원 빵
              </p>
              <p>• 빵꾸러미 하나에 여러 개의 같은 빵도 담을 수 있어요</p>
              <p className="pl-4 text-[13px] text-gray-500">
                예시) 10,000원 빵꾸러미 = 5,000원 빵 2개
              </p>
            </div>
          </div>
        </div>

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
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CurrencyDollarIcon className="w-5 h-5 text-[#FC973B]" />
              <span className="text-[16px] text-gray-900">빵꾸러미 가격</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={form.price || ''}
                onChange={handlePriceChange}
                onBlur={handlePriceBlur}
                className="w-24 text-right border rounded-[8px] px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#FC973B]"
              />
              <span className="text-[14px] text-gray-600">원</span>
            </div>
          </div>

          {/* 수량 입력 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HashtagIcon className="w-5 h-5 text-[#FC973B]" />
              <span className="text-[16px] text-gray-900">준비할 수량</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => handleQuantityChange('decrease')}
                className="w-8 h-8 rounded-full border border-[#FC973B] text-[#FC973B] flex items-center justify-center hover:bg-[#FFF5EC]"
                disabled={form.quantity <= 1}
              >
                -
              </button>
              <span className="text-[18px] min-w-[20px] text-center">{form.quantity}</span>
              <button 
                onClick={() => handleQuantityChange('increase')}
                className="w-8 h-8 rounded-full border border-[#FC973B] text-[#FC973B] flex items-center justify-center hover:bg-[#FFF5EC]"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 총 금액 표시 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-[16px] text-gray-900">총 금액</span>
            <span className="text-[20px] font-bold text-[#FC973B]">
              {(form.price * form.quantity).toLocaleString()}원
            </span>
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