import React from 'react';
import breadPackageIcon from '../../../../assets/images/bakery/bread_pakage.svg';
import { OWNER_CONSTANTS } from '../../../../constants/owner';

export const BreadPackageInfo = () => {
  return (
    <>
      <div className="flex mb-6">
        <div className="flex flex-1 mx-1 border-b">
          <button className="flex-1 py-2 border-b-2 border-[#FC973B] text-[#333333] font-bold">빵꾸러미</button>
          <button className="flex-1 py-2 text-gray-400">리뷰</button>
        </div>
      </div>

      <h2 className="text-[20px] font-bold mb-4">빵꾸러미 정보</h2>

      <div className="bg-[#F9F9F9] rounded-[10px] p-4 mb-6 mx-auto border border-[#FC973B] w-[400px] h-[251px] flex-shrink-0">
        <p className="text-sm text-[#333333] font-bold mb-3">빵꾸러미 1개당</p>
        
        <div className="flex items-center gap-[6px] mb-8">
          <img 
            src={breadPackageIcon} 
            alt="빵꾸러미" 
            className="w-[24px] h-[24px] mt-1"
          />
          <div className="flex items-center gap-2">
            <span className="text-[24px] font-bold">2,000원</span>
            <span className="text-[24px] font-bold text-[#FC973B]">× 6개</span>
          </div>
        </div>

        <div className="bg-[#FC973B] text-white p-3 rounded-[10px] mb-3">
          <div className="flex justify-between px-2">
            <span className="font-medium">오늘 빵꾸러미로 번 돈</span>
            <span className="font-bold">12,000원</span>
          </div>
        </div>

        <div className="bg-[#FC973B] text-white p-3 rounded-[10px]">
          <div className="flex justify-between px-2">
            <span className="font-medium">오늘 절약한 환경 수치</span>
            <span className="font-bold">20g</span>
          </div>
        </div>
      </div>
    </>
  );
}; 