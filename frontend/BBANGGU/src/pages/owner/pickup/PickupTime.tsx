import { useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import BottomNavigation from '../../../components/owner/navigations/BottomNavigations/BottomNavigation';

function PickupTime() {
  const [selectedDay, setSelectedDay] = useState('금');
  const days = ['월', '화', '수', '목', '금', '토', '일'];

  const handleBack = () => {
    window.history.back();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('픽업 시간 저장');
  };

  return (
    <div className="min-h-screen bg-white px-4 pb-20">
      {/* 헤더 */}
      <div className="flex items-center h-14">
        <button onClick={handleBack} className="p-2">
          <IoArrowBack className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium ml-2">픽업시간 설정</h1>
      </div>

      {/* 요일 선택 섹션 */}
      <div className="mt-6">
        <h2 className="text-sm mb-2">판매 요일 선택</h2>
        <p className="text-sm text-gray-500 mb-4">판매하고 싶은 요일을 선택해주세요</p>
        <div className="flex justify-between gap-2">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`w-10 h-10 rounded-full flex items-center justify-center
                ${selectedDay === day 
                  ? 'bg-[#FF9B50] text-white' 
                  : 'border border-gray-200 text-gray-500'
                }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* 픽업 시간 설정 폼 */}
      <div className="mt-8">
        <h2 className="text-sm mb-2">픽업 시간 설정</h2>
        <p className="text-sm text-gray-500 mb-4">
          픽업을 원하는 시간을 설정해주세요
          <br />
          저장된 시간은 추후 재고 등록시 동록시 빠르게 불러올 수 있습니다
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {days.map((day) => (
            <div key={day} className="flex items-center gap-4">
              <span className="w-16">{day}요일</span>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="time"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-200"
                />
                <span className="text-gray-400">~</span>
                <input
                  type="time"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-200"
                />
              </div>
            </div>
          ))}

          {/* 저장 버튼 */}
          <button
            type="submit"
            className="w-full bg-[#FF9B50] text-white py-4 rounded-lg mt-8"
          >
            완료
          </button>
        </form>
      </div>

      <BottomNavigation />
    </div>
  );
}

export default PickupTime;