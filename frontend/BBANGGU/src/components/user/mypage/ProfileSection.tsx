import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import type { UserType } from "../../../types/bakery"
// import { useNavigate } from "react-router-dom" 

interface ProfileSectionProps {
  user?: UserType | null;  // user를 선택적 prop으로 변경
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const imgBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;
  // const navigate = useNavigate();
  // 리덕스에서 사용자 정보 가져오기
  const userInfo = useSelector((state: RootState) => state.user.userInfo)

  return (
    <div className="bg-[#F9F9F9] rounded-xl p-[25px] shadow-md stroke-[#C0C0C0]">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-[20px]">
            <h2 className="text-[24px] font-semibold text-[#333333]">{user?.name || '사용자'} <span className="font-normal text-[#333333]">님</span></h2>
          </div>
          <div className="bg-[#fc973b] text-white font-bold rounded-full px-4 py-1 mt-2 text-[12px]">내가 산 빵꾸러미 : {0}개</div>
        </div>
        <img
          src={
            userInfo?.profileImageUrl ? `${imgBaseUrl}${userInfo.profileImageUrl}` : `${imgBaseUrl}/uploads/bakery19.jpeg`
          }
          alt="Profile"
          className="w-[90px] h-[90px] rounded-full object-cover"
        />
      </div>
    </div>
  )
}

