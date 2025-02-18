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

interface BreadCombination {
  breads: {
    name: string;
    quantity: number;
    breadId: number;
  }[];
  totalprice: number;
}

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
  const packageData = location.state?.packageSuggestions as BreadCombination[][] | undefined;
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [packageCount, setPackageCount] = useState<number>(0);
  const [packageDetails, setPackageDetails] = useState<PackageDetail[]>([]);
  const [isManualOpen, setIsManualOpen] = useState<boolean>(false);
  const [registrationMode, setRegistrationMode] = useState<'auto' | 'manual' | null>(null);

  useEffect(() => {
    if (!packageData || !Array.isArray(packageData)) {
      navigate(-1);
      return;
    }

    const suggestions = packageData.map((pkg, index) => ({
      id: index + 1,
      price: Math.min(...pkg.map(item => item.totalprice)),
      count: pkg.length,
      packages: pkg.map((combination, pkgIndex) => ({
        id: pkgIndex + 1,
        contents: combination.breads.map(bread => 
          `${bread.name} x ${bread.quantity}`
        ).join(', ')
      }))
    }));

    setPackageDetails(suggestions);
  }, [packageData, navigate]);

  const handlePackageSelect = (id: number) => {
    if (isManualOpen) return; // 수동 모드가 열려있으면 선택 불가

    // 이미 선택된 패키지를 다시 클릭하면 선택 해제
    if (selectedPackage === id) {
      setSelectedPackage(null);
      setPackageCount(0);
      setRegistrationMode(null);
      return;
    }
    
    setSelectedPackage(id);
    setRegistrationMode('auto');
    const selectedPkg = packageDetails[id - 1];
    setPackageCount(selectedPkg.count);
  };

  const calculatePrice = () => {
    if (!selectedPackage) return 0;
    const selectedPkg = packageDetails[selectedPackage - 1];
    const totalPrice = selectedPkg.price * selectedPkg.count;
    // 50% 할인된 가격으로 계산 (toLocaleString 제거)
    return Math.floor((totalPrice / packageCount) * 0.5);
  };

  const calculateTotalPrice = () => {
    if (!selectedPackage) return 0;
    const selectedPkg = packageDetails[selectedPackage - 1];
    const totalPrice = selectedPkg.price * selectedPkg.count;
    // 50% 할인된 총 금액
    return Math.floor(totalPrice * 0.5).toLocaleString();
  };

  // 총 빵 개수와 총 금액 계산
  const calculateTotalStats = () => {
    // location.state에서 원본 요청 데이터 가져오기
    const originalItems = location.state?.originalItems;
    if (!originalItems) return { totalCount: 0, totalPrice: 0 };

    // 총 빵 개수: 각 빵의 count 합산
    const totalCount = originalItems.reduce((sum: number, item: { count: number }) => 
      sum + item.count, 0
    );

    // 총 금액: 각 빵의 (가격 * 개수) 합산
    const totalPrice = originalItems.reduce((sum: number, item: { price: number; count: number }) => 
      sum + (item.price * item.count), 0
    );

    return { totalCount, totalPrice };
  };

  const { totalCount, totalPrice } = calculateTotalStats();

  const handleManualToggle = () => {
    const newIsOpen = !isManualOpen;
    setIsManualOpen(newIsOpen);
    
    if (newIsOpen) {
      // 수동 모드 활성화 시 자동 선택 초기화
      setSelectedPackage(null);
      setPackageCount(1); // 수동 모드의 기본값
      setRegistrationMode('manual');
    } else {
      // 수동 모드 비활성화 시
      setPackageCount(0);
      setRegistrationMode(null);
    }
  };

  // 수동 모드용 카운트 변경 핸들러 추가
  const handleManualCountChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      if (packageCount < totalCount) {  // 총 빵 개수를 넘지 않도록
        setPackageCount(prev => prev + 1);
      }
    } else {
      setPackageCount(prev => Math.max(prev - 1, 1));  // 최소 1개
    }
  };

  // 수동 모드용 가격 계산 함수
  const calculateManualPrice = () => {
    if (packageCount === 0) return 0;
    // 총 금액을 빵꾸러미 개수로 나누고 50% 할인
    return Math.floor((totalPrice / packageCount) * 0.5);
  };

  // 수동 모드용 총 금액 계산 함수
  const calculateManualTotalPrice = () => {
    // 총 금액의 50% 할인
    return Math.floor(totalPrice * 0.5);
  };

  // 수동 모드 감소 버튼 disabled 조건
  const isManualDecreaseDisabled = () => {
    return packageCount <= 1;
  };

  // 수동 모드 증가 버튼 disabled 조건
  const isManualIncreaseDisabled = () => {
    return packageCount >= totalCount;
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
          <div className={`grid grid-cols-3 gap-4 ${isManualOpen ? 'opacity-50 pointer-events-none' : ''}`}>
            {packageDetails.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-white rounded-[8px] p-4 text-center cursor-pointer
                  ${isManualOpen ? 'cursor-not-allowed' : 'hover:bg-[#FFF9F5]'}
                  active:scale-95 transition-transform duration-200
                  ${selectedPackage === pkg.id 
                    ? 'ring-2 ring-[#FC973B] bg-[#FFF9F5]' 
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

        {/* 추천 빵꾸러미 구성 섹션 아래에 추가 */}
        {selectedPackage && (
          <>
            {/* 섹션 제목 */}
            <div className="mt-6 mb-4">
              <h2 className="text-[20px] font-bold text-[#242424]">
                50% 마감 할인으로 모두가 윈윈!
              </h2>
              <p className="text-[14px] text-[#6B7280] mt-1">
                남은 빵도 판매하고 고객도 합리적인 가격으로 구매할 수 있어요
              </p>
            </div>

            {/* 판매 정보 컨테이너 */}
            <div className="bg-white rounded-[8px] shadow-[0_-2px_4px_-1px_rgba(0,0,0,0.06),0_4px_6px_-1px_rgba(0,0,0,0.1)] p-6 mb-12">
              {/* 판매 정보 */}
              <div className="space-y-4">
                {/* 가격 정보 */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] text-[#242424]">개당 판매가격 (50% 할인)</span>
                    <span className="text-[14px] text-[#6B7280]">x {packageCount}개</span>
                  </div>
                  <span className="text-[16px] text-[#242424]">{calculatePrice()}원</span>
                </div>

                {/* 구분선 */}
                <div className="h-[1px] bg-[#E5E5E5]" />

                {/* 최종 판매 금액 */}
                <div className="flex justify-between items-center">
                  <span className="text-[16px] text-[#242424]">총 판매 금액</span>
                  <span className="text-[18px] font-bold text-[#FC973B]">{calculateTotalPrice()}원</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* 수기 등록 섹션 - 드롭다운 스타일 */}
        <div className="mt-8 mb-12">
          {/* 드롭다운 헤더 */}
          <button 
            onClick={handleManualToggle}
            className={`w-full flex items-center justify-between p-5
              ${selectedPackage ? 'opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-[#FFF9F5] to-white hover:from-[#FFF5EC]'} 
              rounded-xl border border-[#FFE5D1] transition-all duration-200
              ${isManualOpen ? 'shadow-lg ring-1 ring-[#FC973B]' : 'shadow-sm hover:shadow-md'}`}
            disabled={selectedPackage !== null}
          >
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <img src={breadBagIcon} alt="Manual" className="w-5 h-5" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[16px] text-[#242424] font-medium">수기로 등록하고 싶다면?</span>
                <span className="text-[14px] text-[#FC973B]">총 {totalCount}개의 빵을 원하는대로 나눠보세요</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] text-[#6B7280]">
                {isManualOpen ? '접기' : '펼치기'}
              </span>
              <svg 
                className={`w-5 h-5 text-[#FC973B] transition-transform duration-300 ease-in-out
                  ${isManualOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* 드롭다운 콘텐츠 */}
          {isManualOpen && (
            <div className="mt-3 bg-white rounded-xl shadow-lg border border-[#FFE5D1] p-6 
              animate-slide-down transition-all duration-300">
              <div className="space-y-6">
                {/* 빵꾸러미 개수 선택 */}
                <div className="flex justify-between items-center">
                  <span className="text-[16px] text-[#242424] font-medium">빵꾸러미 개수</span>
                  <div className="flex items-center gap-4 bg-[#FFF9F5] px-4 py-2 rounded-lg">
                    <button 
                      onClick={() => handleManualCountChange('decrease')}
                      disabled={isManualDecreaseDisabled()}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all
                        ${isManualDecreaseDisabled()
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-[#FC973B] hover:bg-white hover:shadow-sm active:scale-95'
                        }`}
                    >
                      -
                    </button>
                    <span className="text-[18px] font-medium min-w-[24px] text-center text-[#242424]">
                      {packageCount}
                    </span>
                    <button 
                      onClick={() => handleManualCountChange('increase')}
                      disabled={isManualIncreaseDisabled()}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all
                        ${isManualIncreaseDisabled()
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-[#FC973B] hover:bg-white hover:shadow-sm active:scale-95'
                        }`}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 구분선 */}
                <div className="h-[1px] bg-[#FFE5D1]" />

                {/* 가격 정보 */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] text-[#242424]">개당 판매가격 (50% 할인)</span>
                      <span className="text-[14px] text-[#FC973B]">x {packageCount}개</span>
                    </div>
                    <span className="text-[16px] font-medium text-[#242424]">
                      {calculateManualPrice().toLocaleString()}원
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-[#FFF9F5] p-4 rounded-lg">
                    <span className="text-[16px] font-medium text-[#242424]">총 판매 금액</span>
                    <span className="text-[20px] font-bold text-[#FC973B]">
                      {calculateManualTotalPrice().toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="mt-auto pt-4">
          <button
            className={`w-full py-4 rounded-[8px] text-[16px] font-medium
              ${packageCount > 0 
                ? 'bg-[#FC973B] text-white hover:bg-[#e88934] transition-colors' 
                : 'bg-[#D7C5B5] text-white cursor-not-allowed'}`}
            onClick={() => {
              const calculatedPrice = registrationMode === 'auto' 
                ? calculatePrice() 
                : calculateManualPrice();
              
              console.log('Navigating with values:', {
                mode: registrationMode,
                price: calculatedPrice,
                quantity: packageCount
              });

              navigate('/owner/package/packing-guide', {
                state: {
                  mode: registrationMode,
                  price: calculatedPrice,  // 숫자 값 전달
                  quantity: packageCount,
                  selectedPackage,
                  packageDetails
                }
              });
            }}
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
