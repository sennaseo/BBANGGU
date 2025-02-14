import { useState, useEffect } from 'react';
import { Header } from '../../../components/owner/editprofile/Header';
import { SubmitButton } from '../../../common/form/SubmitButton';
import BottomNavigation from '../../../components/owner/navigations/BottomNavigations/BottomNavigation';
import { useNavigate, useLocation } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/24/outline';
import { updatePickupTime } from '../../../api/pickup/pickup';

interface PickupTime {
  startTime: string;
  endTime: string;
}

interface PickupTimes {
  monday: PickupTime | null;
  tuesday: PickupTime | null;
  wednesday: PickupTime | null;
  thursday: PickupTime | null;
  friday: PickupTime | null;
  saturday: PickupTime | null;
  sunday: PickupTime | null;
}

interface LocationState {
  bakeryId: number;
  pickupTimes: PickupTimes;
}

function PickupTime() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bakeryId, pickupTimes } = location.state as LocationState;

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [timeData, setTimeData] = useState<{ [key: string]: PickupTime }>({});
  
  const dayMapping = {
    '월': 'monday',
    '화': 'tuesday',
    '수': 'wednesday',
    '목': 'thursday',
    '금': 'friday',
    '토': 'saturday',
    '일': 'sunday'
  };

  // 초기 데이터 설정
  useEffect(() => {
    const initialSelectedDays: string[] = [];
    const initialTimeData: { [key: string]: PickupTime } = {};

    Object.entries(pickupTimes).forEach(([key, value]) => {
      if (value) {
        const koreanDay = Object.entries(dayMapping).find(([_, eng]) => eng === key)?.[0];
        if (koreanDay) {
          initialSelectedDays.push(koreanDay);
          initialTimeData[koreanDay] = value;
        }
      }
    });

    setSelectedDays(initialSelectedDays);
    setTimeData(initialTimeData);
  }, [pickupTimes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const requestData: { [key: string]: PickupTime } = {};
      
      selectedDays.forEach(day => {
        const engDay = dayMapping[day as keyof typeof dayMapping];
        if (timeData[day]) {
          requestData[engDay] = timeData[day];
        }
      });

      await updatePickupTime(bakeryId, requestData);
      alert('픽업 시간이 성공적으로 수정되었습니다.');
      navigate('/owner/mypage');
    } catch (error) {
      console.error('픽업 시간 수정 실패:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('픽업 시간 수정에 실패했습니다.');
      }
    }
  };

  const handleDayClick = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleTimeChange = (day: string, type: 'startTime' | 'endTime', value: string) => {
    setTimeData(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value
      }
    }));
  };

  const inputClassName = "w-full px-4 py-3 rounded-[8px] border border-[#EFEFEF] placeholder-[#8E8E8E] focus:outline-none focus:border-[#FF9B50]";
  const disabledInputClassName = "w-full px-4 py-3 rounded-[8px] border border-[#EFEFEF] bg-[#F5F5F5] text-[#8E8E8E] cursor-not-allowed";

  // 시간 옵션 생성
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

  const timeOptions = generateTimeOptions();

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header title="픽업시간 설정" />
      
      <form onSubmit={handleSubmit} className="p-4 space-y-8">
        {/* 요일 선택 섹션 */}
        <div className="space-y-4">
          <div>
            <h3 className="text-[16px] font-bold text-[#242424] mb-2">판매 요일 선택</h3>
            <p className="text-[14px] text-[#6B7280] mb-4">
              판매하고 싶은 요일을 선택하여 시간을 설정해주세요
            </p>
          </div>
          <div className="flex justify-between gap-2">
            {Object.keys(dayMapping).map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => handleDayClick(day)}
                className={`w-11 h-11 rounded-full flex items-center justify-center font-medium transition-colors
                  ${selectedDays.includes(day)
                    ? 'bg-[#FC973B] text-white' 
                    : 'border border-[#E5E5E5] text-[#6B7280] hover:border-[#FC973B] hover:text-[#FC973B]'
                  }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* 픽업 시간 설정 폼 */}
        <div className="space-y-4">
          <div>
            <h3 className="text-[16px] font-bold text-[#242424] mb-2">픽업 시간 설정</h3>
            <p className="text-[14px] text-[#6B7280] mb-4">
              픽업을 원하는 시간을 설정해주세요
              <br />
              저장된 시간은 추후 빵꾸러미 등록 시 자동으로 불러올 수 있습니다
            </p>
          </div>

          <div className="space-y-3">
            {Object.keys(dayMapping).map((day) => {
              const isSelected = selectedDays.includes(day);
              const dayTime = timeData[day] || { startTime: '', endTime: '' };
              
              return (
                <div key={day} className={`flex items-center gap-3 ${!isSelected && 'opacity-50'}`}>
                  <span className="w-16 text-[14px] text-[#242424] font-medium">{day}요일</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 relative">
                      <select
                        disabled={!isSelected}
                        value={dayTime.startTime}
                        onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                        className={`${isSelected ? inputClassName : disabledInputClassName} appearance-none`}
                      >
                        <option value="" disabled>시간 선택</option>
                        {timeOptions.map((time) => (
                          <option key={`start-${time}`} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ClockIcon className="w-5 h-5 text-[#6B7280]" />
                      </div>
                    </div>
                    <span className="text-[#6B7280]">~</span>
                    <div className="flex-1 relative">
                      <select
                        disabled={!isSelected}
                        value={dayTime.endTime}
                        onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                        className={`${isSelected ? inputClassName : disabledInputClassName} appearance-none`}
                      >
                        <option value="" disabled>시간 선택</option>
                        {timeOptions.map((time) => (
                          <option key={`end-${time}`} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <ClockIcon className="w-5 h-5 text-[#6B7280]" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedDays.length > 0 && (
          <div className="flex items-start gap-2 text-[14px] text-[#FC973B]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <p>설정된 시간은 빵꾸러미 등록 시 자동으로 적용됩니다</p>
          </div>
        )}

        <SubmitButton
          text="완료"
          className="mt-8"
        />
      </form>

      <BottomNavigation />
    </div>
  );
}

export default PickupTime;