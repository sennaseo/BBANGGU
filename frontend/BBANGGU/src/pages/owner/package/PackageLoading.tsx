import React from 'react';
import { useNavigate } from 'react-router-dom';
import breadLoading from '../../../assets/images/bakery/bread_loading.gif';

const PackageLoading: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="h-[100vh] bg-white flex flex-col cursor-pointer" 
      onClick={() => navigate('/owner/package/register')}
    >
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* 빵 로딩 애니메이션 */}
        <div className="mb-16">
          <img 
            src={breadLoading} 
            alt="bread loading" 
            className="w-[240px]"
          />
        </div>

        {/* 로딩 스피너 */}
        <div className="mb-8">
          <div className="w-12 h-12 border-4 border-[#FC973B] border-t-transparent rounded-full animate-spin" />
        </div>

        {/* 안내 메시지 */}
        <p className="text-[18px] text-gray-900 font-medium mb-2">
          빵 꾸러미를 조합하고 있습니다
        </p>
        <p className="text-[14px] text-gray-600">
          잠시만 기다려주세요
        </p>
      </div>
    </div>
  );
};

export default PackageLoading;