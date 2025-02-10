import { useState } from 'react';
import { Header } from '../../../components/owner/editprofile/Header';
import { SubmitButton } from '../../../common/form/SubmitButton';
import BottomNavigation from '../../../components/owner/navigations/BottomNavigations/BottomNavigation';
import { useNavigate } from 'react-router-dom';
import { ClockIcon } from '@heroicons/react/24/outline';

function PickupTime() {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 나중에 여기에 API 호출 로직이 들어갈 예정
    navigate('/owner/mypage');
  };

  const handleDayClick = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
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
            {days.map((day) => (
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
            {days.map((day) => {
              const isSelected = selectedDays.includes(day);
              return (
                <div key={day} className={`flex items-center gap-3 ${!isSelected && 'opacity-50'}`}>
                  <span className="w-16 text-[14px] text-[#242424] font-medium">{day}요일</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 relative">
                      <select
                        disabled={!isSelected}
                        className={`${isSelected ? inputClassName : disabledInputClassName} appearance-none`}
                        defaultValue=""
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
                        className={`${isSelected ? inputClassName : disabledInputClassName} appearance-none`}
                        defaultValue=""
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