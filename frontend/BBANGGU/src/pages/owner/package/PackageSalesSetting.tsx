import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/owner/header/Header';
import ProgressBar from './components/Progress.Bar';
import { PACKAGE_STEPS, TOTAL_PACKAGE_STEPS } from './constants/PakageSteps';

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
    for (let minute of ['00', '30']) {
      const time = `${hour.toString().padStart(2, '0')}:${minute}`;
      options.push(time);
    }
  }
  return options;
};

const PackageSalesSetting: React.FC = () => {
  const navigate = useNavigate();
  const [packageName, setPackageName] = useState('');
  const [packageDescription, setPackageDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const timeOptions = generateTimeOptions();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        title="판매 설정" 
        onBack={() => navigate(-1)}
      />
      
      <div className="mt-4">
        <ProgressBar 
          currentStep={PACKAGE_STEPS.SALES} 
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

        {/* 빵꾸러미 설명 */}
        <div className="mb-8">
          <h3 className="text-[16px] font-bold text-[#242424] mb-2">빵꾸러미 설명</h3>
          <p className="text-[14px] text-gray-600 mb-4">
            가게의 음식을 자랑을 담아 설명해주세요 :)
          </p>
          <textarea
            placeholder="ex) 크로아상과 식빵 등이 담길 수 있는 맛있는 빵꾸러미입니다!!"
            value={packageDescription}
            onChange={(e) => setPackageDescription(e.target.value)}
            className="w-full h-[120px] px-4 py-3 rounded-[8px] border border-[#E5E5E5] text-[16px] placeholder:text-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-[#FC973B]"
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
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-[8px] border border-[#E5E5E5] text-[16px] appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#FC973B]"
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
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-[8px] border border-[#E5E5E5] text-[16px] appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#FC973B]"
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

        {/* 하단 버튼 */}
        <div className="mt-auto pt-4">
          <button
            className="w-full bg-[#FC973B] text-white py-4 rounded-[8px] text-[16px] font-medium"
            onClick={() => {
              // TODO: 판매 시작 로직 구현
              navigate('/owner/main');  // 메인 페이지로 이동
            }}
          >
            빵꾸러미 판매 시작
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageSalesSetting; 