import defaultBakeryImage from '../../../../assets/images/bakery/onwer_default_header_img.png';
import cameraIcon from '../../../../assets/images/bakery/owner_camera_icon.svg';
import { useNavigate } from 'react-router-dom';

interface BreadPackageHeaderProps {
  hasPackage: boolean;  // 빵꾸러미 존재 여부
}

export const BreadPackageHeader = ({ hasPackage }: BreadPackageHeaderProps) => {
  const navigate = useNavigate();

  const handleCameraClick = () => {
    if (hasPackage) {
      alert('이미 등록된 빵꾸러미가 있습니다.');
      return;
    }
    navigate('/owner/package/guide');
  };

  const handleManualRegister = () => {
    if (hasPackage) {
      alert('이미 등록된 빵꾸러미가 있습니다.');
      return;
    }
    navigate('/owner/package/setting');
  };

  return (
    <div className="mb-6 flex flex-col items-center">
      <div className="relative w-[400px] h-[220px] flex-shrink-0 mb-4">
        <img 
          src={defaultBakeryImage}
          alt="빵집 이미지" 
          className="w-full h-full object-cover rounded-[20px]"
        />
        <div className="absolute inset-0 bg-black/30 rounded-[20px]"></div>
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="pl-[55px] text-white">
            <p className="text-[20px] leading-[160%]">사진 촬영 시</p>
            <p className="text-[20px] leading-[160%]">AI가 자동으로</p>
            <p className="text-[20px] leading-[160%]">
              <span className="font-bold text-[#FC973B]">재고를 분석</span>
              <span>해줘요</span>
            </p>
          </div>
          <div className="absolute top-1/2 left-[240px] transform -translate-y-1/2">
            <div 
              onClick={handleCameraClick}
              className={`relative flex flex-col items-center justify-center w-[100px] h-[100px] 
                rounded-[12px] cursor-pointer transition-all duration-200 touch-manipulation select-none
                ${hasPackage 
                  ? 'bg-gray-500/40 cursor-not-allowed' 
                  : 'bg-black/40 hover:bg-black/50 active:bg-black/60 active:scale-95'
                }`}
            >
              <div className={`absolute top-0 left-0 w-[25px] h-[25px] border-t-[3px] border-l-[3px] border-[#FC973B] rounded-tl-[15px] ${hasPackage ? 'opacity-50' : ''}`} />
              <div className={`absolute top-0 right-0 w-[25px] h-[25px] border-t-[3px] border-r-[3px] border-[#FC973B] rounded-tr-[15px] ${hasPackage ? 'opacity-50' : ''}`} />
              <div className={`absolute bottom-0 left-0 w-[25px] h-[25px] border-b-[3px] border-l-[3px] border-[#FC973B] rounded-bl-[15px] ${hasPackage ? 'opacity-50' : ''}`} />
              <div className={`absolute bottom-0 right-0 w-[25px] h-[25px] border-b-[3px] border-r-[3px] border-[#FC973B] rounded-br-[15px] ${hasPackage ? 'opacity-50' : ''}`} />
              
              <img 
                src={cameraIcon} 
                alt="카메라" 
                className={`w-[50px] h-[50px] mb-2 ${hasPackage ? 'opacity-50' : ''}`}
              />
              <span className="text-white text-[12px] font-bold">
                {hasPackage ? '등록완료' : '빵꾸러미 등록'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleManualRegister}
        disabled={hasPackage}
        className={`w-[400px] py-2.5 rounded-xl font-medium
          transition-all duration-200 flex items-center justify-center gap-1.5
          text-sm shadow-sm
          ${hasPackage 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
            : 'bg-white text-gray-600 border border-gray-200 hover:border-[#FC973B] hover:text-[#FC973B]'
          }`}
      >
        <span>수기로 빵꾸러미 등록하기</span>
        <span className={hasPackage ? 'text-gray-400' : 'text-[#FC973B]'}>›</span>
      </button>
    </div>
  );
}; 