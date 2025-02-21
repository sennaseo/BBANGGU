import { useEffect, useState } from "react";
import { mainApi } from "../../../api/user/main/mainApi";
import { PackageType } from "../../../types/bakery";

interface BakeryPackageProps {
  bakeryId: number
}

export default function BakeryPackage({ bakeryId }: BakeryPackageProps) {
  const [packageData, setPackageData] = useState<PackageType>();

  useEffect(() => {
    async function fetchPackages() {
      try {
        if (bakeryId) {
          const data = await mainApi.getPackagesByBakeryId(bakeryId);
          setPackageData(data[0] ?? { quantity: 0, pending: 0, price: 0 });
        }
      } catch (error) {
        console.error("패키지 데이터를 불러오는 중 오류 발생:", error);
      }
    }
    fetchPackages();
  }, [bakeryId]);

  if (packageData?.quantity === 0) {
    return (
      <div className="pb-[40px] px-[20px]">
        <h2 className="text-[16px] font-bold mb-[15px] text-[#333333]">판매 중인 빵꾸러미</h2>
        <p className="text-[14px] text-[#757575]">현재 판매중인 빵꾸러미가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="pb-[20px] px-[20px]">
      <h2 className="text-[16px] font-bold mb-[15px] text-[#333333]">판매 중인 빵꾸러미</h2>
      <div className="bg-white border border-[#F2F2F2] shadow-md rounded-xl p-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-[#FFF5E9] rounded-xl w-[104px] h-[104px]">
            <img
              src="/bakery/빵꾸러미.png"
              alt="빵꾸러미"
              className=" h-[80px]"
            />
          </div>
          <div>
            <h3 className="text-[18px] font-bold mb-2 text-[#333333]">{packageData?.name}</h3>
            <div className="flex flex-col gap-2">
              <span className="text-[15px] text-[#A9A9A9]">남은 수량: <span className="font-bold">{(packageData?.quantity ?? 0) - (packageData?.pending ?? 0)}개</span></span>
              <div className="flex items-center gap-1">
                <span className="text-[18px] font-bold text-[#333333]">{packageData?.price.toLocaleString()}원</span>
                <span className="text-[14px] text-[#E1E1E1] line-through">{((packageData?.price ?? 0) * 2).toLocaleString()}원</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 