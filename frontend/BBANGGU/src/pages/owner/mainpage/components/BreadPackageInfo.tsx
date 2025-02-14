import React from 'react';
import { EllipsisVerticalIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import breadPackageIcon from '../../../../assets/images/bakery/bread_pakage.svg';

interface BreadPackage {
  bakeryId: number;
  breadCategoryId: number;
  name: string;
  price: number;
  breadImageUrl: string | null;
}

interface BreadPackageInfoProps {
  packages: BreadPackage[];
}

export const BreadPackageInfo: React.FC<BreadPackageInfoProps> = ({ packages }) => {
  console.log('BreadPackageInfo에 전달된 packages:', packages);
  const [showMenu, setShowMenu] = React.useState(false);
  const navigate = useNavigate();

  // packages가 undefined이거나 빈 배열일 때의 처리
  const currentPackage = packages?.[0];
  
  // 안전한 숫자 변환 함수
  const safeToLocaleString = (num?: number) => {
    return num?.toLocaleString() ?? '0';
  };

  const handleEdit = () => {
    navigate('/owner/package/register', {
      state: {
        isEditing: true,
        packageInfo: currentPackage
      }
    });
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (window.confirm('빵꾸러미를 삭제하시겠습니까?')) {
      // TODO: 삭제 API 호출
      setShowMenu(false);
    }
  };

  // 패키지가 없는 경우 빈 상태 표시
  if (!currentPackage) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 bg-[#F9F9F9] rounded-[10px] border border-dashed border-[#E5E5E5] mb-6">
        <img 
          src={breadPackageIcon} 
          alt="빵꾸러미" 
          className="w-16 h-16 mb-4 opacity-50"
        />
        <p className="text-[#6B7280] text-center mb-6">
          등록된 빵꾸러미가 없습니다<br/>
          새로운 빵꾸러미를 등록해보세요!
        </p>
        <button
          onClick={() => navigate('/owner/package/guide')}
          className="px-6 py-3 bg-[#FC973B] text-white rounded-[8px] hover:bg-[#e88934] transition-colors"
        >
          빵꾸러미 등록하기
        </button>
      </div>
    );
  }

  // 총 판매 수량 계산 (임시로 1로 설정)
  const quantity = 1;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[20px] font-bold">빵꾸러미 정보</h2>
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
      </div>

      <div className="bg-[#F9F9F9] rounded-[10px] p-4 mb-6 mx-auto border border-[#FC973B] w-[400px] h-[251px] flex-shrink-0">
        <p className="text-sm text-[#333333] font-bold mb-3">빵꾸러미 1개당</p>
        
        <div className="flex items-center gap-[6px] mb-8">
          <img 
            src={breadPackageIcon} 
            alt={currentPackage.name}
            className="w-[24px] h-[24px] mt-1"
          />
          <div className="flex items-center gap-2">
            <span className="text-[24px] font-bold">
              {safeToLocaleString(currentPackage.price)}원
            </span>
            <span className="text-[24px] font-bold text-[#FC973B]">
              × {quantity}개
            </span>
          </div>
        </div>

        <div className="bg-[#FC973B] text-white p-3 rounded-[10px] mb-3">
          <div className="flex justify-between px-2">
            <span className="font-medium">오늘 빵꾸러미로 번 돈</span>
            <span className="font-bold">
              {safeToLocaleString(currentPackage.price * quantity)}원
            </span>
          </div>
        </div>

        <div className="bg-[#FC973B] text-white p-3 rounded-[10px]">
          <div className="flex justify-between px-2">
            <span className="font-medium">오늘 절약한 환경 수치</span>
            <span className="font-bold">{quantity * 20}g</span>
          </div>
        </div>
      </div>
    </>
  );
}; 