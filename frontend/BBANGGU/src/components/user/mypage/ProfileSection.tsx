import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import type { UserType } from "../../../types/bakery"
import { useNavigate } from 'react-router-dom';

interface ProfileSectionProps {
  user: UserType | null
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const navigate = useNavigate();
  // 리덕스에서 사용자 정보 가져오기
  const userInfo = useSelector((state: RootState) => state.user.userInfo)

  return (
    <div className="bg-[#F9F9F9] rounded-xl p-[30px] shadow-md stroke-[#C0C0C0]">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-[30px]">
            <h2 className="text-[24px] font-semibold text-[#333333]">{userInfo?.name || '사용자'} <span className="font-normal text-[#333333]">님</span></h2>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => navigate('/mypage/edit')}
              className="cursor-pointer"
            >
              <path
                d="M15.8333 10.8333V15.8333H4.16667V4.16667H9.16667V2.5H4.16667C3.24167 2.5 2.5 3.25 2.5 4.16667V15.8333C2.5 16.75 3.24167 17.5 4.16667 17.5H15.8333C16.75 17.5 17.5 16.75 17.5 15.8333V10.8333H15.8333ZM11.6667 2.5V4.16667H14.6583L7.05 11.775L8.225 12.95L15.8333 5.34167V8.33333H17.5V2.5H11.6667Z"
                fill="#C0C0C0"
              />
            </svg>
          </div>
          <div className="bg-[#fc973b] text-white font-bold rounded-full px-4 py-1 mt-2 text-[12px]">내가 산 빵꾸러미 : {0}개</div>
        </div>
        <img
          src={
            user?.profile_image_url ||
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%ED%94%84%EB%A1%9C%ED%95%84-ScdL8EY3W1qOzEzfLjiBi3XnSU4HAp.png"
          }
          alt="Profile"
          className="w-[80px] h-[80px] rounded-full object-cover"
        />
      </div>
    </div>
  )
}

