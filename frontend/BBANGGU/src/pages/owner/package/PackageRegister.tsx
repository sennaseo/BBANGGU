import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../../components/owner/header/Header';
import ProgressBar from './components/Progress.Bar';
import { PACKAGE_STEPS, TOTAL_PACKAGE_STEPS } from './constants/PakageSteps';
import breadLogo from '../../../assets/images/bakery/bread_logo.svg';
import breadIcon from '../../../assets/images/bakery/bread_icon.png';
import wonIcon from '../../../assets/images/bakery/won_icon.png';
import robotIcon from '../../../assets/images/bakery/robot.svg';
import breadBagIcon from '../../../assets/images/bakery/bread_pakage.svg';

interface PackageDetail {
  id: number;
  price: number;
  count: number;
  packages: {
    id: number;
    contents: string;
  }[];
}

const PackageRegister: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const packageData = location.state?.packageSuggestions;
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [packageCount, setPackageCount] = useState<number>(0);
  const [packageDetails, setPackageDetails] = useState<PackageDetail[]>([]);

  useEffect(() => {
    if (!packageData) {
      // 데이터 없이 직접 접근한 경우 이전 페이지로
      navigate(-1);
      return;
    }

    // 받은 데이터로 패키지 상세 정보 설정
    const suggestions = packageData.map((pkg: any, index: number) => ({
      id: index + 1,
      price: pkg[0].total_price,  // 첫 번째 조합의 가격 사용
      count: pkg.length,  // 조합 개수
      packages: pkg.map((combination: any, pkgIndex: number) => ({
        id: pkgIndex + 1,
        contents: combination.breads.map((bread: any) => 
          `${bread.name} x ${bread.quantity}`
        ).join(', ')
      }))
    }));

    setPackageDetails(suggestions);
  }, [packageData, navigate]);

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

  // 감소 버튼 disabled 조건을 위한 함수 추가
  const isDecreaseDisabled = () => {
    if (!selectedPackage) return true;
    return packageCount <= 1;  // 1보다 작아지지 않도록
  };

  // 총 빵 개수와 총 금액 계산
  const calculateTotalStats = () => {
    if (!packageData) return { totalCount: 0, totalPrice: 0 };

    // 첫 번째 조합의 모든 빵을 합산 (모든 조합은 동일한 빵을 사용)
    const firstCombination = packageData[0]?.[0];
    if (!firstCombination) return { totalCount: 0, totalPrice: 0 };

    const totalCount = firstCombination.breads.reduce((sum: number, bread: { quantity: number }) => 
      sum + bread.quantity, 0
    );

    // 모든 조합의 total_price 중 가장 큰 값 사용
    const totalPrice = Math.max(
      ...packageData.map((combinations: { total_price: number }[]) => 
        combinations[0]?.total_price || 0
      )
    );

    return { totalCount, totalPrice };
  };

  const { totalCount, totalPrice } = calculateTotalStats();

  // 최대 가능한 빵꾸러미 개수 계산
  const maxPackageCount = totalCount;  // 총 빵 개수를 최대값으로 설정

  // 기존의 isIncreaseDisabled 함수 제거하고 새로운 함수로 통합
  const isIncreaseDisabled = () => {
    if (!selectedPackage) return true;
    if (packageCount >= maxPackageCount) return true;  // 최대 개수 제한
    
    const selectedPkg = packageDetails[selectedPackage - 1];
    const totalPrice = selectedPkg.price * selectedPkg.count;
    const nextCount = packageCount + 1;
    return !Number.isInteger(totalPrice / nextCount);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        title="빵꾸러미 등록" 
        onBack={() => navigate(-1)}
      />
      
      <div className="mt-4">
        <ProgressBar 
          currentStep={PACKAGE_STEPS.DETAILS} 
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
              <span className="text-[24px] font-medium">{totalCount}</span>
            </div>

            {/* 중앙 구분선 */}
            <div className="absolute left-1/2 h-full w-[1px] bg-gray-200 transform -translate-x-1/2" />

            {/* 오른쪽: 총 금액 */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <img src={wonIcon} alt="won" className="w-6 h-6" />
                <span className="text-[14px] text-gray-600">총 금액</span>
              </div>
              <span className="text-[24px] font-medium">{totalPrice.toLocaleString()}원</span>
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
            <div className="text-center mb-6">
              <p className="text-[16px] font-medium mb-2">
                50%의 가격으로 빵꾸러미를 만들어보세요!
              </p>
              <p className="text-[14px] text-gray-500 mb-4">
                원하는 개수와 구성으로 자유롭게 준비하실 수 있어요
              </p>
              <div className="bg-[#FFF5EC] rounded-lg p-3 text-[14px] text-[#FC973B]">
                <span className="font-medium">💡 Tip.</span> AI 추천 개수가 적절하지 않나요?<br/>
                최대 {maxPackageCount}개까지 원하시는 만큼 조절해보세요!
              </div>
            </div>
            
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

            {/* 가격 정보 표시 */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[16px] text-[#242424]">개당 가격</span>
                <span className="text-[16px] text-[#242424]">{calculatePrice()}원</span>
              </div>
              <div className="h-[1px] bg-[#E5E5E5]" />
              <div className="flex justify-between items-center">
                <span className="text-[16px] text-[#242424]">총계</span>
                <span className="text-[18px] font-bold text-[#242424]">{calculateTotalPrice()}원</span>
              </div>
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
            onClick={() => navigate('/owner/package/sales-setting', {
              state: {
                price: calculatePrice(),
                quantity: packageCount,
                totalPrice: calculateTotalPrice()
              }
            })}
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
