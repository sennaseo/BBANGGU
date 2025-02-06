import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/owner/header/Header';
import ProgressBar from './components/Progress.Bar';
import { PACKAGE_STEPS, TOTAL_PACKAGE_STEPS } from './constants/PakageSteps';

const PackageRegister: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[100vh] bg-white flex flex-col">
      <Header 
        title="빵꾸러미 등록" 
        onBack={() => navigate(-1)}
      />
      
      <ProgressBar 
        currentStep={PACKAGE_STEPS.REGISTER} 
        totalSteps={TOTAL_PACKAGE_STEPS}
      />

      <div className="flex-1 flex flex-col p-4">
        <div className="mb-6">
          <span className="text-[#FC973B] text-[24px] font-medium">김싸피</span>
          <span className="text-[24px] font-medium"> 사장님,</span>
        </div>

        <div className="bg-white rounded-[8px] shadow-md p-4 mb-6">
          <div className="flex justify-between mb-4">
            <div className="flex items-center gap-2">
              <span>🥖</span>
              <span>총 빵 개수</span>
            </div>
            <span className="text-[18px] font-medium">8</span>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <span>💰</span>
              <span>총 금액</span>
            </div>
            <span className="text-[18px] font-medium">32,000원</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span>🤖</span>
            <span className="text-[16px] font-medium">"이런 조합 어때요?"</span>
          </div>
          <p className="text-[18px] font-medium mb-4">AI가 추천해주는 빵꾸러미 조합</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-[8px] shadow-md p-4 text-center">
              <p className="text-[20px] font-medium mb-2">6,000원</p>
              <p className="text-[14px] text-gray-600">1개 꾸러미</p>
            </div>
            <div className="bg-white rounded-[8px] shadow-md p-4 text-center">
              <p className="text-[20px] font-medium mb-2">3,000원</p>
              <p className="text-[14px] text-gray-600">2개 꾸러미</p>
            </div>
            <div className="bg-white rounded-[8px] shadow-md p-4 text-center">
              <p className="text-[20px] font-medium mb-2">2,000원</p>
              <p className="text-[14px] text-gray-600">3개 꾸러미</p>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-center text-[16px] mb-4">50%의 가격으로 직접 입력할 수 있어요!</p>
          <div className="flex justify-between items-center mb-4">
            <span>빵꾸러미 개수</span>
            <div className="flex items-center gap-4">
              <button className="w-8 h-8 rounded-full border">-</button>
              <span className="text-[18px]">8</span>
              <button className="w-8 h-8 rounded-full border">+</button>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span>가격</span>
            <span>각 2,000원</span>
          </div>
          <div className="flex justify-between items-center">
            <span>총계</span>
            <span className="text-[18px] font-medium">15,900원</span>
          </div>
        </div>

        <button
          className="w-full bg-[#FC973B] text-white py-4 rounded-[8px] text-[16px] font-medium"
          onClick={() => navigate('/owner/package/complete')}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default PackageRegister;
