import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/owner/header/Header';
import ProgressBar from './components/Progress.Bar';
import { PACKAGE_STEPS, TOTAL_PACKAGE_STEPS } from './constants/PakageSteps';

const PackageAnalysis: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        title="재고 촬영" 
        onBack={() => navigate(-1)}
      />
      
      <ProgressBar 
        currentStep={PACKAGE_STEPS.CAMERA}  
        totalSteps={TOTAL_PACKAGE_STEPS}
      />

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
          {/* 카메라 뷰가 들어갈 자리 */}
          <p className="text-gray-500">카메라 준비 중...</p>
        </div>

        <button
          className="w-full bg-[#FC973B] text-white py-4 rounded-lg"
          onClick={() => navigate('/owner/package/preview')}
        >
          촬영하기
        </button>
      </div>
    </div>
  );
};

export default PackageAnalysis; 