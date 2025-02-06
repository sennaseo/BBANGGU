import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/owner/header/Header';
import ProgressBar from './components/Progress.Bar';
import { PACKAGE_STEPS, TOTAL_PACKAGE_STEPS } from './constants/PakageSteps';
import breadLogo from '../../../assets/images/bakery/bread_logo.svg';
import breadIcon from '../../../assets/images/bakery/bread_icon.png';
import wonIcon from '../../../assets/images/bakery/won_icon.png';
import robotIcon from '../../../assets/images/bakery/robot.svg';
import breadBagIcon from '../../../assets/images/bakery/bread_pakage.svg';

const PackageRegister: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [packageCount, setPackageCount] = useState<number>(0);

  const packageDetails = [
    {
      id: 1,
      price: 6000,
      count: 1,
      packages: [
        {
          id: 1,
          contents: '크로아상 x 1, 우유식빵 x 1, 크림단팥빵 x 2'
        }
      ]
    },
    {
      id: 2,
      price: 3000,
      count: 2,
      packages: [
        {
          id: 1,
          contents: '소금빵 x 1, 커피번 x 1, 크림단팥빵 x 2'
        },
        {
          id: 2,
          contents: '크로아상 x 2, 우유식빵 x 1, 소금빵 x 1'
        }
      ]
    },
    {
      id: 3,
      price: 2000,
      count: 3,
      packages: [
        {
          id: 1,
          contents: '크로아상 x 2, 소금빵 x 1, 크림단팥빵 x 1'
        },
        {
          id: 2,
          contents: '우유식빵 x 2, 커피번 x 1, 소금빵 x 1'
        },
        {
          id: 3,
          contents: '크림단팥빵 x 2, 크로아상 x 1, 커피번 x 1'
        }
      ]
    }
  ];

  const handlePackageSelect = (id: number) => {
    // 이미 선택된 패키지를 다시 클릭하면 선택 해제
    if (selectedPackage === id) {
      setSelectedPackage(null);
      setPackageCount(0);  // 개수도 초기화
      return;
    }
    
    setSelectedPackage(id);
    const selectedPkg = packageDetails[id - 1];
    setPackageCount(selectedPkg.count);
  };

  const handleCountChange = (type: 'increase' | 'decrease') => {
    if (!selectedPackage) return;
    
    const selectedPkg = packageDetails[selectedPackage - 1];
    const totalPrice = selectedPkg.price * selectedPkg.count;  // 총 가격
    
    if (type === 'increase') {
      const nextCount = packageCount + 1;
      // 다음 개수로 나눴을 때 소수점이 없는 경우만 증가
      if (nextCount <= 10 && Number.isInteger(totalPrice / nextCount)) {
        setPackageCount(nextCount);
      }
    } else {
      setPackageCount(prev => Math.max(prev - 1, 1));  // 최소값 1로 변경
    }
  };

  const calculatePrice = () => {
    if (!selectedPackage) return 0;
    const selectedPkg = packageDetails[selectedPackage - 1];
    const totalPrice = selectedPkg.price * selectedPkg.count;
    return Math.floor(totalPrice / packageCount).toLocaleString();
  };

  const calculateTotalPrice = () => {
    if (!selectedPackage) return 0;
    const selectedPkg = packageDetails[selectedPackage - 1];
    const totalPrice = selectedPkg.price * selectedPkg.count;
    return totalPrice.toLocaleString();
  };

  // 증가 버튼 조건 수정
  const isIncreaseDisabled = () => {
    if (!selectedPackage) return true;
    if (packageCount >= 10) return true;
    
    const selectedPkg = packageDetails[selectedPackage - 1];
    const totalPrice = selectedPkg.price * selectedPkg.count;
    const nextCount = packageCount + 1;
    return !Number.isInteger(totalPrice / nextCount);
  };

  // 감소 버튼 disabled 조건을 위한 함수 추가
  const isDecreaseDisabled = () => {
    if (!selectedPackage) return true;
    return packageCount <= 1;  // 1보다 작아지지 않도록
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        title="빵꾸러미 등록" 
        onBack={() => navigate(-1)}
      />
      
      <div className="mt-4">
        <ProgressBar 
          currentStep={PACKAGE_STEPS.REGISTER} 
          totalSteps={TOTAL_PACKAGE_STEPS}
        />
      </div>

      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        <div className="flex justify-between items-start mb-0 mt-4 relative">
          <div className="flex flex-col pt-2">
            <div className="flex items-center mb-2">
              <span className="text-[#FC973B] text-[30px] font-bold">김싸피</span>
              <span className="text-[24px] font-normal"> 사장님,</span>
            </div>
            <p className="text-[14px] text-gray-600 max-w-[240px] whitespace-nowrap">
              AI가 계산한 최적의 가격과 구성은 어떠신가요?
            </p>
          </div>
          <img 
            src={breadLogo} 
            alt="bread logo" 
            className="w-[120px] h-[120px]"
          />
        </div>

        <div className="bg-white rounded-[8px] shadow-[0_-2px_4px_-1px_rgba(0,0,0,0.06),0_4px_6px_-1px_rgba(0,0,0,0.1)] p-4 mb-6 -mt-6 relative z-10">
          <div className="grid grid-cols-2 gap-4 relative">
            {/* 왼쪽: 총 빵 개수 */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <img src={breadIcon} alt="bread" className="w-6 h-6" />
                <span className="text-[14px] text-gray-600">총 빵 개수</span>
              </div>
              <span className="text-[24px] font-medium">8</span>
            </div>

            {/* 중앙 구분선 */}
            <div className="absolute left-1/2 h-full w-[1px] bg-gray-200 transform -translate-x-1/2" />

            {/* 오른쪽: 총 금액 */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <img src={wonIcon} alt="won" className="w-6 h-6" />
                <span className="text-[14px] text-gray-600">총 금액</span>
              </div>
              <span className="text-[24px] font-medium">32,000원</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[8px] shadow-[0_-2px_4px_-1px_rgba(0,0,0,0.06),0_4px_6px_-1px_rgba(0,0,0,0.1)] p-6 mb-6">
          {/* 상단 로봇 아이콘과 텍스트 */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-2 mb-2">
              <img src={robotIcon} alt="robot" className="w-6 h-6" />
              <span className="text-[16px] font-medium text-[#424242]">"이런 조합 어때요?"</span>
            </div>
            <p className="text-[20px] font-bold text-[#242424]">AI가 추천해주는 빵꾸러미 조합</p>
          </div>

          {/* 추천 조합 카드들 */}
          <div className="grid grid-cols-3 gap-4">
            {packageDetails.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-[8px] p-4 text-center 
                  active:scale-95 transition-transform duration-200
                  ${selectedPackage === pkg.id 
                    ? 'ring-2 ring-[#FC973B] bg-[#FFF9F5] shadow-[0_-2px_4px_-1px_rgba(0,0,0,0.06),0_4px_6px_-1px_rgba(0,0,0,0.1)]' 
                    : 'border border-[#E5E5E5]'
                  }`}
                onClick={() => handlePackageSelect(pkg.id)}
              >
                <div className="flex justify-center items-center gap-1 mb-2">
                  <span className={`text-[18px] font-bold ${selectedPackage === pkg.id ? 'text-[#FC973B]' : 'text-[#242424]'}`}>
                    {pkg.price.toLocaleString()}
                  </span>
                  <span className={`text-[16px] font-bold ${selectedPackage === pkg.id ? 'text-[#FC973B]' : 'text-[#242424]'}`}>
                    원
                  </span>
                </div>
                <p className={`text-[14px] ${selectedPackage === pkg.id ? 'text-[#FC973B]' : 'text-[#6B7280]'}`}>
                  {pkg.count}개 꾸러미
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 선택된 빵꾸러미 구성 */}
        {selectedPackage && (
          <div className="mt-6 mb-12 animate-slide-down">
            <h3 className="text-[18px] font-bold text-[#242424] mb-4">추천 빵꾸러미 구성</h3>
            <div className="bg-white rounded-[8px] shadow-[0_-2px_4px_-1px_rgba(0,0,0,0.06),0_4px_6px_-1px_rgba(0,0,0,0.1)] p-4">
              <div className="space-y-3">
                {packageDetails[selectedPackage - 1].packages.map((pkg, index) => (
                  <div 
                    key={pkg.id}
                    className="bg-[#FAFBFC] rounded-[8px] p-4 border border-[#E5E5E5] animate-fade-scale-in"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
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
          </div>
        )}

        <div className="flex-1">
          <div className="bg-white rounded-[8px] shadow-[0_-2px_4px_-1px_rgba(0,0,0,0.06),0_4px_6px_-1px_rgba(0,0,0,0.1)] p-6 mb-8">
            <p className="text-center text-[16px] font-medium mb-8">
              50%의 가격으로 빵꾸러미를 만들어보세요!<br/>
              <span className="text-[14px] text-gray-500">
                원하는 개수와 구성으로 자유롭게 준비하실 수 있어요
              </span>
            </p>
            
            {/* 빵꾸러미 개수 */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-[16px] text-[#242424]">빵꾸러미 개수</span>
              <div className="flex items-center gap-4">
                <button 
                  className={`w-8 h-8 rounded-full border flex items-center justify-center
                    transition-all duration-200 
                    ${(!selectedPackage || isDecreaseDisabled())
                      ? 'border-[#E5E5E5] text-gray-300 cursor-not-allowed bg-gray-50'
                      : 'border-[#FC973B] text-[#FC973B] cursor-pointer hover:bg-[#FFF9F5] active:bg-[#FC973B] active:text-white'
                    }`}
                  onClick={() => handleCountChange('decrease')}
                  disabled={!selectedPackage || isDecreaseDisabled()}
                >
                  <span className="text-lg">-</span>
                </button>
                <span className="text-[18px] min-w-[20px] text-center">{packageCount}</span>
                <button 
                  className={`w-8 h-8 rounded-full border flex items-center justify-center
                    transition-all duration-200
                    ${(!selectedPackage || isIncreaseDisabled())
                      ? 'border-[#E5E5E5] text-gray-300 cursor-not-allowed bg-gray-50'
                      : 'border-[#FC973B] text-[#FC973B] cursor-pointer hover:bg-[#FFF9F5] active:bg-[#FC973B] active:text-white'
                    }`}
                  onClick={() => handleCountChange('increase')}
                  disabled={!selectedPackage || isIncreaseDisabled()}
                >
                  <span className="text-lg">+</span>
                </button>
              </div>
            </div>

            {/* 구분선 */}
            <div className="h-[1px] bg-[#E5E5E5] my-4" />

            {/* 가격 */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-[16px] text-[#242424]">가격</span>
              <span className="text-[16px] text-[#242424]">
                각 {calculatePrice()}원
              </span>
            </div>

            {/* 총계 */}
            <div className="flex justify-between items-center">
              <span className="text-[16px] text-[#242424]">총계</span>
              <span className="text-[18px] font-bold text-[#242424]">{calculateTotalPrice()}원</span>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-auto pt-4">
          <button
            className={`w-full py-4 rounded-[8px] text-[16px] font-medium
              ${packageCount > 0 
                ? 'bg-[#FC973B] text-white hover:bg-[#e88934] transition-colors' 
                : 'bg-[#D7C5B5] text-white cursor-not-allowed'}`}
            onClick={() => navigate('/owner/package/sales-setting')}
            disabled={packageCount === 0}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageRegister;
