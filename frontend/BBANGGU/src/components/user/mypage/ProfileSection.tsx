import { useSelector } from 'react-redux'
import { RootState } from '../../../store'

export function ProfileSection() {
  // 리덕스에서 사용자 정보 가져오기
  const userInfo = useSelector((state: RootState) => state.user.userInfo)

  return (
    <div className="bg-[#F9F9F9] rounded-xl p-[25px] shadow-md stroke-[#C0C0C0]">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-[20px]">
            <h2 className="text-[24px] font-semibold text-[#333333]">{userInfo?.name || '사용자'} <span className="font-normal text-[#333333]">님</span></h2>
          </div>
          <div className="bg-[#fc973b] text-white font-bold rounded-full px-4 py-1 mt-2 text-[12px]">내가 산 빵꾸러미 : {0}개</div>
        </div>
        <img
          src={
            userInfo?.profileImageUrl ||
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%ED%94%84%EB%A1%9C%ED%95%84-ScdL8EY3W1qOzEzfLjiBi3XnSU4HAp.png"
          }
          alt="Profile"
          className="w-[90px] h-[90px] rounded-full object-cover"
        />
      </div>
    </div>
  )
}

