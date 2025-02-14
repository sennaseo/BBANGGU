import type { UserType } from "../../../types/bakery"

interface ProfileSectionProps {
  user: UserType | null
}

export function ProfileSection({ user }: ProfileSectionProps) {

  return (
    <div className="bg-[#F9F9F9] rounded-xl p-[25px] shadow-md stroke-[#C0C0C0]">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-[20px]">
            <h2 className="text-[24px] font-bold text-[#333333]">{user?.name} <span className="font-normal text-[#333333]">님</span></h2>
          </div>
          <div className="bg-[#fc973b] text-white font-bold rounded-full px-4 py-1 mt-2 text-[12px]">내가 산 빵꾸러미 : {0}개</div>
        </div>
        <img
          src={
            user?.profileImageUrl ||
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%ED%94%84%EB%A1%9C%ED%95%84-ScdL8EY3W1qOzEzfLjiBi3XnSU4HAp.png"
          }
          alt="Profile"
          className="w-[90px] h-[90px] rounded-full object-cover"
        />
      </div>
    </div>
  )
}

