import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import breadLoading from '/bakery/cat.gif';
import breadLoading2 from '/bakery/wrote.gif';

const PackageLoading: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 3초 후 자동으로 다음 페이지로 이동
    const timer = setTimeout(() => {
      navigate('/owner/package/register', {
        state: location.state // 이전 페이지에서 받은 state를 그대로 전달
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, location.state]);

  return (
    <div className="h-[100vh] bg-[#FDFCFB] flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* 빵 로딩 애니메이션 */}
        <div className="mb-10">
          <img 
            src={breadLoading} 
            alt="bread loading" 
            className="w-[250px]"
          />
        </div>

        {/* 로딩 스피너 */}
        <div className="mb-8">
          <div className="w-12 h-12 border-4 border-[#FC973B] border-t-transparent rounded-full animate-spin" />
        </div>

        {/* 안내 메시지 */}
        <img 
          src={breadLoading2} 
          alt="bread loading" 
          className="w-[250px]"
        />
      </div>
    </div>
  );
};

export default PackageLoading;