import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../../components/owner/header/Header';
import ProgressBar from './components/Progress.Bar';
import { PACKAGE_STEPS, TOTAL_PACKAGE_STEPS } from './constants/PakageSteps';
import breadBagIcon from '../../../assets/images/bakery/bread_pakage.svg';

interface PackageGuideProps {
  mode: 'auto' | 'manual';
  price: number;
  quantity: number;
  selectedPackage?: number;
  packageDetails?: Array<{
    id: number;
    packages: Array<{
      id: number;
      contents: string;
    }>;
  }>;
}

const PackagePackingGuide: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, price, quantity, selectedPackage, packageDetails } = location.state as PackageGuideProps;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        title="포장 안내" 
        onBack={() => navigate(-1)}
      />
      
      <div className="mt-4">
        <ProgressBar 
          currentStep={PACKAGE_STEPS.PACKING} 
          totalSteps={TOTAL_PACKAGE_STEPS}
        />
      </div>

      <div className="flex-1 flex flex-col p-4">
        {/* 안내 메시지 */}
        <div className="mb-8">
          <h2 className="text-[20px] font-bold text-[#242424] mb-2">
            {mode === 'auto' 
              ? 'AI가 추천한 조합대로 포장해주세요'
              : '설정한 금액에 맞게 포장해주세요'}
          </h2>
          <p className="text-[14px] text-[#6B7280]">
            {mode === 'auto'
              ? '고객님이 균일한 구성으로 받을 수 있도록 동일하게 포장해주세요'
              : `${price.toLocaleString()}원 상당의 빵을 ${quantity}개의 꾸러미로 포장해주세요`}
          </p>
        </div>

        {mode === 'auto' && selectedPackage && packageDetails && (
          <div className="bg-white rounded-[8px] shadow-[0_-2px_4px_-1px_rgba(0,0,0,0.06),0_4px_6px_-1px_rgba(0,0,0,0.1)] p-6">
            <div className="space-y-4">
              {packageDetails[selectedPackage - 1].packages.map((pkg, index) => (
                <div 
                  key={pkg.id}
                  className="bg-[#FAFBFC] rounded-[8px] p-4 border border-[#E5E5E5]"
                >
                  <div className="flex items-center gap-3">
                    <img src={breadBagIcon} alt="bread bag" className="w-6 h-6" />
                    <div>
                      <p className="font-medium text-[16px] text-[#242424] mb-1">
                        빵꾸러미 {index + 1}
                      </p>
                      <p className="text-[14px] text-[#6B7280]">
                        {pkg.contents}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="mt-auto pt-4">
          <button
            className="w-full bg-[#FC973B] text-white py-4 rounded-[8px] text-[16px] font-medium"
            onClick={() => navigate('/owner/package/sales-setting', {
              state: {
                mode,
                price,
                quantity,
                selectedPackage
              }
            })}
          >
            포장 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackagePackingGuide; 