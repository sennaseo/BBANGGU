import React from 'react';
import defaultBakeryImage from '../../../../assets/images/bakery/onwer_default_header_img.png';
import cameraIcon from '../../../../assets/images/bakery/owner_camera_icon.svg';
import { useNavigate } from 'react-router-dom';

export const BreadPackageHeader = () => {
  const navigate = useNavigate();

  const handleCameraClick = () => {
    navigate('/owner/package/guide');
  };

  const handleManualRegister = () => {
    navigate('/owner/package/setting');
  };

  return (
    <div className="relative mb-6 w-[400px] h-[220px] flex-shrink-0 mx-auto">
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
            className="relative flex flex-col items-center justify-center w-[100px] h-[100px] 
            bg-black/40 rounded-[12px] cursor-pointer 
            hover:bg-black/50 
            active:bg-black/60 
            active:scale-95 
            transition-all duration-200
            touch-manipulation select-none"
          >
            <div className="absolute top-0 left-0 w-[25px] h-[25px] border-t-[3px] border-l-[3px] border-[#FC973B] rounded-tl-[15px]" />
            <div className="absolute top-0 right-0 w-[25px] h-[25px] border-t-[3px] border-r-[3px] border-[#FC973B] rounded-tr-[15px]" />
            <div className="absolute bottom-0 left-0 w-[25px] h-[25px] border-b-[3px] border-l-[3px] border-[#FC973B] rounded-bl-[15px]" />
            <div className="absolute bottom-0 right-0 w-[25px] h-[25px] border-b-[3px] border-r-[3px] border-[#FC973B] rounded-br-[15px]" />
            
            <img 
              src={cameraIcon} 
              alt="카메라" 
              className="w-[50px] h-[50px] mb-2"
            />
            <span className="text-white text-[12px] font-bold">빵꾸러미 등록</span>
          </div>
        </div>
        <div className="absolute bottom-4 right-4">
          <button 
            onClick={handleManualRegister}
            className="text-white text-xs hover:text-[#FC973B] transition-colors duration-200 
              active:scale-95 touch-manipulation select-none"
          >
            수기로 등록하기 ›
          </button>
        </div>
      </div>
    </div>
  );
}; 