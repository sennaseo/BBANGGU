import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitButton } from '../../../common/form/SubmitButton';
import cameraExample from '@/assets/images/bakery/camera_ex.png';
import ProgressBar from './components/Progress.Bar';
import { PACKAGE_STEPS, TOTAL_PACKAGE_STEPS } from './constants/PakageSteps';
import Header from '../../../components/owner/header/Header';

const PackageGuide: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleStartRegister = () => {
    console.log('버튼 클릭됨'); // 디버깅용 로그
    navigate('/owner/package/analysis');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 기존 헤더 마크업을 Header 컴포넌트로 교체 */}
      <Header 
        title="빵꾸러미 촬영하는 법" 
        onBack={handleBack}
      />

      {/* 프로그레스 바 */}
      <ProgressBar 
        currentStep={PACKAGE_STEPS.GUIDE} 
        totalSteps={TOTAL_PACKAGE_STEPS}
      />

      {/* 메인 컨텐츠 */}
      <div className="flex-1 px-4">
        {/* 설명 텍스트 */}
        <div className="mt-4 text-center">
          <p className="text-base text-gray-600">
            예시와 같이 촬영해주세요
          </p>
          <p className="text-[18px] font-bold text-gray-600">
            빵구 AI가 자동으로 빵의 제고와 가격을 파악합니다!
          </p>
        </div>

        {/* AI 분석 예시 이미지 */}
        <div className="mt-6 flex justify-center">
          <img 
            src={cameraExample} 
            alt="카메라 사용 예시" 
            className="w-[300px] rounded-lg mb-4"
          />
        </div>

        {/* 촬영 가이드라인 */}
        <div className="mt-6 space-y-4 pl-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#FC973B] flex items-center justify-center text-white">1</div>
            <p className="text-gray-700">빵을 트레이에 잘 정렬해주세요</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#FC973B] flex items-center justify-center text-white">2</div>
            <p className="text-gray-700">빵이 겹치지 않도록 간격을 두세요</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#FC973B] flex items-center justify-center text-white">3</div>
            <p className="text-gray-700">전체 트레이가 잘 보이게 촬영해주세요</p>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="p-4">
        <SubmitButton
          text={<span className="font-bold">재고 찍으러 가기</span>}
          onClick={handleStartRegister}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default PackageGuide; 