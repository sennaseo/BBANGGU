// import { useNavigate } from 'react-router-dom';
import breadPackageIcon from "/bakery/bread_pakage.svg";
import { ReservationStatus } from "../../../../api/owner/reservation";
import { BreadPackage } from "../../../../api/owner/package";

// 빵꾸러미 수정 / 삭제 기능 주석 처리 - 이번 pjt 에서는 제외
// import React, { useState } from 'react';
// import { EllipsisVerticalIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
// import { deletePackage } from '../../../../api/owner/package';

interface BreadPackageInfoProps {
  currentPackage: BreadPackage;
  reservations: Array<{
    status: ReservationStatus;
    quantitiy: number;
  }>;
  onPackageDeleted?: () => void;
}

export const BreadPackageInfo: React.FC<BreadPackageInfoProps> = ({
  currentPackage,
}) => {
  console.log("currentPackage", currentPackage);
  // const [showMenu, setShowMenu] = useState(false);  // 주석처리

  // 안전한 숫자 변환 함수
  const safeToLocaleString = (num: number) => num?.toLocaleString() || "0";

  /* 수정/삭제 관련 함수들 주석처리
  const handleEdit = () => {
    navigate('/owner/package/setting', {
      state: {
        isEditing: true,
        packageData: currentPackage
      }
    });
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (window.confirm('빵꾸러미를 삭제하시겠습니까?')) {
      try {
        await deletePackage(currentPackage.packageId);
        alert('빵꾸러미가 삭제되었습니다.');
        setShowMenu(false);
        if (onPackageDeleted) {
          onPackageDeleted();
        }
      } catch (error: any) {
        alert(error.response?.data?.message || '빵꾸러미 삭제 중 오류가 발생했습니다.');
      }
    }
  };
  */

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[20px] font-bold">빵꾸러미 정보</h2>
        {/* 더보기 버튼 주석처리
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <EllipsisVerticalIcon className="w-6 h-6 text-[#6B7280]" />
          </button>

          {showMenu && (
            <div className="absolute top-11 right-0 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] rounded-[12px] border border-[#EFEFEF] py-2 z-10 w-32 overflow-hidden">
              <button
                onClick={handleEdit}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#FFF9F5] text-[#242424] flex items-center gap-2 transition-colors"
              >
                <PencilSquareIcon className="w-4 h-4" />
                수정하기
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#FFF9F5] text-red-500 flex items-center gap-2 transition-colors"
              >
                <TrashIcon className="w-4 h-4" />
                삭제하기
              </button>
            </div>
          )}
        </div>
        */}
      </div>

      <div className="bg-white rounded-[20px] border border-gray-100 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
        {/* 빵꾸러미 이름 */}
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-[20px] font-bold text-[#242424]">
            {currentPackage.name}
          </h2>
          <span className="px-2 py-1 bg-[#FFF9F5] text-[#FC973B] text-xs font-medium rounded-full">
            오늘의 빵꾸러미
          </span>
        </div>

        {/* 가격과 수량 정보 */}
        <div className="bg-[#FAFAFA] rounded-xl p-4 mb-8 border border-gray-50">
          <div className="flex items-center gap-6">
            {/* 가격 정보 */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                <img
                  src={breadPackageIcon}
                  alt="빵꾸러미"
                  className="w-6 h-6"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 line-through text-sm">
                  {safeToLocaleString(currentPackage.price * 2)}원
                </span>
                <div className="flex items-center">
                  <span className="text-[24px] font-bold text-[#242424]">
                    {safeToLocaleString(currentPackage.price)}
                  </span>
                  <span className="text-[#FC973B] font-medium ml-1">원</span>
                </div>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-gray-200"></div>

            {/* 수량 정보 */}
            <div className="flex flex-col">
              <div className="flex items-center -ml-1">
                <span className="text-[24px] font-bold text-[#242424]">
                  {currentPackage.quantity}
                </span>
                <span className="text-gray-500 ml-1">
                  / {currentPackage.initialQuantity}개
                </span>
              </div>
              <div className="flex items-center -ml-1">
                <span className="text-[14px] text-gray-400">
                  현재 남은 수량
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-[#FFF9F5] to-[#FFF5EC] rounded-2xl p-4 border border-[#FC973B]/10 shadow-[0_2px_8px_rgba(252,151,59,0.05)]">
            <div className="flex flex-col">
              <span className="text-gray-600 text-sm mb-1">
                오늘 빵꾸러미로 번 돈
              </span>
              <span className="text-[#FC973B] text-xl font-bold">
                {safeToLocaleString(currentPackage.savedMoney)}원
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#FFF9F5] to-[#FFF5EC] rounded-2xl p-4 border border-[#FC973B]/10 shadow-[0_2px_8px_rgba(252,151,59,0.05)]">
            <div className="flex flex-col">
              <span className="text-gray-600 text-sm mb-1">
                오늘 절약한 환경 수치
              </span>
              <span className="text-[#FC973B] text-xl font-bold">
                {(currentPackage.savedMoney / currentPackage.price) * 20}g
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
